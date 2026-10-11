const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Executes the requested tool and returns a JSON string result
 */
async function executeTool(name, args, userId) {
  try {
    switch (name) {
      
      case 'create_task': {
        const { title, priority = 'medium', deadline } = args;
        const task = await Task.create({
          userId,
          title,
          priority,
          deadline: deadline ? new Date(deadline) : null,
          status: 'pending'
        });
        return { success: true, message: `Task '${title}' created successfully.`, taskId: task._id };
      }

      case 'get_tasks': {
        const { status } = args;
        const filter = { userId };
        if (status) filter.status = status;
        
        const tasks = await Task.find(filter).select('title status priority estimatedMinutes deadline').limit(20);
        if (tasks.length === 0) {
          return { success: true, message: "No tasks found." };
        }
        return { success: true, tasks };
      }

      case 'create_project': {
        const { name: projName, description } = args;
        const project = await Project.create({
          userId,
          name: projName,
          description,
          status: 'planning'
        });
        return { success: true, message: `Project '${projName}' created successfully.`, projectId: project._id };
      }

      case 'create_goal': {
        const Goal = require('../models/Goal');
        const { title, description, targetDate } = args;
        const goal = await Goal.create({ 
          userId, 
          title, 
          description, 
          progress: 0,
          targetDate: targetDate ? new Date(targetDate) : null
        });
        return { success: true, message: `Goal '${title}' created successfully.`, goalId: goal._id };
      }

      case 'save_memory': {
        const Memory = require('../models/Memory');
        const { content, type = 'fact' } = args;
        const memory = await Memory.create({ userId, content, type });
        return { success: true, message: `Memory saved.`, memoryId: memory._id };
      }

      case 'get_memories': {
        const Memory = require('../models/Memory');
        const memories = await Memory.find({ userId }).select('content type createdAt');
        if (memories.length === 0) return { success: true, message: "No memories found." };
        return { success: true, memories };
      }

      case 'get_schedule': {
        const Goal = require('../models/Goal');
        
        // Fetch tasks and goals with dates
        const tasks = await Task.find({ userId, deadline: { $ne: null }, status: { $ne: 'completed' } }).lean();
        const goals = await Goal.find({ userId, targetDate: { $ne: null }, status: 'active' }).lean();
        
        const timeline = [];
        tasks.forEach(t => timeline.push({ type: 'task', title: t.title, date: t.deadline }));
        goals.forEach(g => timeline.push({ type: 'goal', title: g.title, date: g.targetDate }));
        
        timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (timeline.length === 0) return { success: true, message: "Schedule is totally clear. No upcoming tasks or goals with deadlines." };
        return { success: true, schedule: timeline };
      }

      case 'add_learning_topic': {
        const Topic = require('../models/Topic');
        const { title, description } = args;
        const topic = await Topic.create({ userId, title, description, mastery: 0 });
        return { success: true, message: `Topic '${title}' added to your learning hub.`, topicId: topic._id };
      }

      case 'update_mastery': {
        const Topic = require('../models/Topic');
        const { topicTitle, scoreChange } = args;
        const topic = await Topic.findOne({ userId, title: new RegExp(`^${topicTitle}$`, 'i') });
        if (!topic) return { success: false, error: `Topic '${topicTitle}' not found.` };
        
        let newMastery = topic.mastery + scoreChange;
        if (newMastery > 100) newMastery = 100;
        if (newMastery < 0) newMastery = 0;
        
        topic.mastery = newMastery;
        await topic.save();
        
        return { success: true, message: `Mastery updated by ${scoreChange}. New score is ${newMastery}%.` };
      }

      case 'open_website': {
        let { url } = args;
        
        // INTERCEPT YOUTUBE SEARCHES TO AUTO-PLAY THE FIRST VIDEO
        if (url.includes('youtube.com/results?search_query=')) {
          try {
            console.log(`[YouTube Intercept] Scraping video ID for: ${url}`);
            const response = await fetch(url);
            const html = await response.text();
            // Look for the first video ID in the YouTube HTML
            const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
            if (match) {
              const videoId = match[1];
              url = `https://www.youtube.com/watch?v=${videoId}`;
              console.log(`[YouTube Intercept] Found video ID! Upgrading URL to auto-play: ${url}`);
            }
          } catch (e) {
            console.error('[YouTube Intercept] Failed to parse video ID:', e);
            // If it fails, we just fall back to the search URL, which is fine!
          }
        }

        return { 
          success: true, 
          message: `Successfully requested to open ${url}. IMPORTANT: You MUST reply to the user saying you are opening it, and you MUST append the exact string [OPEN_WEBSITE:${url}] at the very end of your final response.` 
        };
      }

      default:
        return { success: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    console.error(`Tool Execution Error (${name}):`, err);
    return { success: false, error: err.message };
  }
}

module.exports = { executeTool };
