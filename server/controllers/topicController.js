const Topic = require('../models/Topic');

// GET /api/topics
const getTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ topics });
  } catch (err) { next(err); }
};

// POST /api/topics
const createTopic = async (req, res, next) => {
  try {
    const { title, description, mastery } = req.body;
    if (!title) return res.status(400).json({ error: 'Topic title is required' });

    const topic = await Topic.create({
      userId: req.user._id,
      title,
      description,
      mastery: mastery || 0
    });
    res.status(201).json({ topic });
  } catch (err) { next(err); }
};

// PATCH /api/topics/:id
const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.status(200).json({ topic });
  } catch (err) { next(err); }
};

// DELETE /api/topics/:id
const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.status(200).json({ message: 'Topic deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTopics, createTopic, updateTopic, deleteTopic };
