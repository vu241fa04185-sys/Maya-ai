const Memory = require('../models/Memory');

// GET /api/memories
const getMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ memories });
  } catch (err) { next(err); }
};

// POST /api/memories
const createMemory = async (req, res, next) => {
  try {
    const { content, type, importance } = req.body;
    if (!content) return res.status(400).json({ error: 'Memory content is required.' });
    const memory = await Memory.create({
      userId: req.user._id,
      content,
      type: type || 'fact',
      importance: importance || 'medium',
    });
    res.status(201).json({ memory });
  } catch (err) { next(err); }
};

// DELETE /api/memories/:id
const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!memory) return res.status(404).json({ error: 'Memory not found.' });
    res.status(200).json({ message: 'Memory deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getMemories, createMemory, deleteMemory };
