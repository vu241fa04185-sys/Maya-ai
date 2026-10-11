/**
 * Definitions for MAYA's Tools (Function Calling)
 * These JSON schemas tell Gemini what tools it can use.
 */

const toolDeclarations = [
  {
    name: "create_task",
    description: "Creates a new task in the user's task manager. Use this when the user asks you to remind them to do something, add a task, or create a to-do.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "The main title of the task (e.g., 'Buy groceries', 'Finish homework')" },
        priority: { type: "STRING", description: "The priority of the task. Must be 'low', 'medium', or 'high'. Default to 'medium'." },
        deadline: { type: "STRING", description: "Optional. ISO 8601 Date string for when the task is due." }
      },
      required: ["title", "priority"]
    }
  },
  {
    name: "get_tasks",
    description: "Fetches the user's current pending and completed tasks. Use this when the user asks 'what do I have to do?', 'show my tasks', or wants to review their to-do list.",
    parameters: {
      type: "OBJECT",
      properties: {
        status: { type: "STRING", description: "Optional. Filter by status: 'pending', 'in-progress', or 'completed'." }
      }
    }
  },
  {
    name: "create_project",
    description: "Creates a new project in the user's workspace. Use this when the user wants to start a new project, app, or large goal.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: "The name of the project." },
        description: { type: "STRING", description: "A short description of what the project is about." }
      },
      required: ["name"]
    }
  },
  {
    name: "create_goal",
    description: "Creates a long-term goal for the user. Use this when the user says they want to learn something, achieve something over months, or set a big objective.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "The title of the goal (e.g., 'Learn Python', 'Run a marathon')" },
        description: { type: "STRING", description: "Details about the goal" },
        targetDate: { type: "STRING", description: "Optional. ISO 8601 Date string for when the goal should be achieved." }
      },
      required: ["title"]
    }
  },
  {
    name: "save_memory",
    description: "Saves a fact about the user to long-term memory so you don't forget it. Use this when the user mentions their preferences, schedule, likes/dislikes, personal info, or constraints.",
    parameters: {
      type: "OBJECT",
      properties: {
        content: { type: "STRING", description: "The fact to remember (e.g., 'User prefers dark mode', 'User wakes up at 6am')" },
        type: { type: "STRING", description: "Category of memory: 'personal', 'project', 'preference', 'fact', or 'routine'" }
      },
      required: ["content"]
    }
  },
  {
    name: "get_memories",
    description: "Retrieves all saved long-term memories about the user. Use this to refresh your memory on the user's preferences or facts.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "get_schedule",
    description: "Retrieves the user's timeline of tasks and goals that have deadlines. Use this when the user asks 'what's on my schedule', 'what do I have today', or 'what's coming up'.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "add_learning_topic",
    description: "Adds a new topic that the user wants to study or learn. Use this when the user says 'I want to learn X' or 'Add X to my learning topics'.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "The topic the user wants to learn (e.g., 'Spanish', 'React Hooks')" },
        description: { type: "STRING", description: "Brief description of the learning topic." }
      },
      required: ["title"]
    }
  },
  {
    name: "update_mastery",
    description: "Updates the user's mastery score for a learning topic. Use this when you quiz the user and they answer correctly or incorrectly to adjust their score.",
    parameters: {
      type: "OBJECT",
      properties: {
        topicTitle: { type: "STRING", description: "The exact title of the topic you are testing." },
        scoreChange: { type: "NUMBER", description: "How much to change the mastery (e.g., +10 for correct, -5 for incorrect)." }
      },
      required: ["topicTitle", "scoreChange"]
    }
  },
  {
    name: "open_website",
    description: "Opens websites and performs web actions. IMPORTANT RULES: 1. If user says 'Play [song] on YouTube', use url: 'https://www.youtube.com/results?search_query=[song]'. 2. If user says 'Search Google for [query]', use url: 'https://www.google.com/search?q=[query]'. 3. If user says 'Send WhatsApp message [text]', use url: 'https://web.whatsapp.com/send?text=[text]'. 4. Otherwise use standard URLs like 'https://www.youtube.com'.",
    parameters: {
      type: "OBJECT",
      properties: {
        url: { type: "STRING", description: "The specially formatted URL to execute the user's web action." }
      },
      required: ["url"]
    }
  }
];

module.exports = { toolDeclarations };
