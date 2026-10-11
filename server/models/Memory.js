const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['personal', 'project', 'preference', 'goal', 'fact', 'routine'],
    default: 'fact',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
}, { timestamps: true });

module.exports = mongoose.model('Memory', memorySchema);
