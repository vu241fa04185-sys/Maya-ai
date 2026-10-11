const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'paused'],
    default: 'planning',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  technologies: {
    type: [String],
    default: [],
  },
  deadline: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
