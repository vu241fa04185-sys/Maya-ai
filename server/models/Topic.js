const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
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
  mastery: {
    type: Number,
    default: 0, // 0 to 100
    min: 0,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
