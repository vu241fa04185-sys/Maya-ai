const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
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
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
  progress: {
    type: Number,
    default: 0, // 0 to 100 percentage
    min: 0,
    max: 100
  },
  targetDate: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
