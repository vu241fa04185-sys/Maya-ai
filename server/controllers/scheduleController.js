const Task = require('../models/Task');
const Goal = require('../models/Goal');

// GET /api/schedule
const getSchedule = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all pending tasks and active goals that have deadlines
    const tasks = await Task.find({ 
      userId, 
      status: { $ne: 'completed' } 
    }).lean();

    const goals = await Goal.find({ 
      userId, 
      status: 'active' 
    }).lean();

    // Combine them into a unified timeline array
    const timeline = [];

    tasks.forEach(task => {
      if (task.deadline) {
        timeline.push({
          type: 'task',
          id: task._id,
          title: task.title,
          priority: task.priority,
          date: new Date(task.deadline)
        });
      }
    });

    goals.forEach(goal => {
      if (goal.targetDate) {
        timeline.push({
          type: 'goal',
          id: goal._id,
          title: goal.title,
          progress: goal.progress,
          date: new Date(goal.targetDate)
        });
      }
    });

    // Sort chronologically (earliest first)
    timeline.sort((a, b) => a.date - b.date);

    res.status(200).json({ schedule: timeline });
  } catch (err) { next(err); }
};

module.exports = { getSchedule };
