const { sendMessage } = require('../services/llmService');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// POST /api/chat
const chat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim())
      return res.status(400).json({ error: 'Message is required.' });

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });
    }

    if (!conversation) {
      // Auto-title from first message (first 50 chars)
      const title = message.trim().substring(0, 50) + (message.length > 50 ? '...' : '');
      conversation = await Conversation.create({
        userId: req.user._id,
        title,
      });
    }

    // Save user message to MongoDB
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: message.trim(),
    });

    // Load full conversation history from MongoDB (last 30 messages)
    const history = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(30);

    // Build history array for LLM (exclude the last message — it's the current one)
    const historyForLLM = history.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call LLM
    const reply = await sendMessage(message.trim(), historyForLLM, req.user._id);

    // Save MAYA's response to MongoDB
    await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: reply,
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversation._id, { updatedAt: new Date() });

    res.status(200).json({
      reply,
      conversationId: conversation._id,
    });
  } catch (err) { next(err); }
};

module.exports = { chat };
