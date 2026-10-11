const Groq = require('groq-sdk');
const { MAYA_SYSTEM_PROMPT } = require('../config/maya');
const { toolDeclarations } = require('./agentTools');
const { executeTool } = require('./toolExecutor');
const Memory = require('../models/Memory'); // Import Memory model

// Initialize Groq (checks GROQ_API_KEY first, falls back to GEMINI_API_KEY if they just replaced the value)
const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
const groq = new Groq({ apiKey });

// Map Gemini tool schema to Groq/OpenAI tool schema
const groqTools = toolDeclarations.map(t => ({
  type: "function",
  function: {
    name: t.name,
    description: t.description,
    parameters: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(t.parameters.properties).map(([k, v]) => [
          k,
          { ...v, type: (v.type || "string").toLowerCase() }
        ])
      ),
      required: t.parameters.required || []
    }
  }
}));

/**
 * Sends a message to MAYA using Groq and handles tool calling execution
 */
async function sendMessage(userMessage, history = [], userId) {
  try {
    // Format history for Groq
    const groqHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // 🧠 Fetch the user's long-term memories from the database!
    let memoryContext = '';
    if (userId) {
      const userMemories = await Memory.find({ userId });
      if (userMemories.length > 0) {
        memoryContext = '\n\nCRITICAL CONTEXT (You must remember this about the user):\n' + 
          userMemories.map(m => `- [${m.type.toUpperCase()}] ${m.content}`).join('\n');
      }
    }

    const messages = [
      { role: 'system', content: MAYA_SYSTEM_PROMPT + memoryContext },
      ...groqHistory,
      { role: 'user', content: userMessage }
    ];

    let result = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages,
      tools: groqTools,
      tool_choice: 'auto',
      max_tokens: 1024
    });

    const responseMessage = result.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      // Append the assistant's tool call message
      messages.push(responseMessage);

      // Groq requires tool responses to have role "tool" and the tool_call_id
      for (const toolCall of toolCalls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`[MAYA Agent] Executing Groq tool: ${name}`, args);
        
        const executionResult = await executeTool(name, args, userId);
        
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: name,
          content: JSON.stringify(executionResult)
        });
      }

      // Send the tool results back to Groq
      result = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages,
        tools: groqTools
      });
      
      return result.choices[0].message.content;
    }

    return responseMessage.content;
  } catch (err) {
    console.error("[Groq Error]:", err.message);
    throw err;
  }
}

module.exports = { sendMessage };
