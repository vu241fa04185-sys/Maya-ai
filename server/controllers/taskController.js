const Task = require('../models/Task');

// GET /api/tasks (Can pass ?projectId=... to filter)
const getTasks = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) { next(err); }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ task });
  } catch (err) { next(err); }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, status, priority, estimatedMinutes, deadline } = req.body;
    if (!title) return res.status(400).json({ error: 'Task title is required' });

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      projectId: projectId || null,
      status,
      priority,
      estimatedMinutes,
      deadline,
      completedAt: status === 'completed' ? new Date() : null
    });
    res.status(201).json({ task });
  } catch (err) { next(err); }
};

// PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    
    // Auto-handle completedAt timestamp
    if (updates.status === 'completed') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'completed') {
      updates.completedAt = null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ task });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
