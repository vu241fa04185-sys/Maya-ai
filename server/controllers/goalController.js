const Goal = require('../models/Goal');

// GET /api/goals
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ goals });
  } catch (err) { next(err); }
};

// POST /api/goals
const createGoal = async (req, res, next) => {
  try {
    const { title, description, targetDate, progress } = req.body;
    if (!title) return res.status(400).json({ error: 'Goal title is required' });

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      description,
      targetDate,
      progress: progress || 0,
      status: 'active'
    });
    res.status(201).json({ goal });
  } catch (err) { next(err); }
};

// PATCH /api/goals/:id
const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json({ goal });
  } catch (err) { next(err); }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json({ message: 'Goal deleted' });
  } catch (err) { next(err); }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
