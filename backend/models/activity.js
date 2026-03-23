
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sport', 'nutrition', 'mental', 'todo', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: { type: String, trim: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  date: { type: Date, required: true, default: Date.now },
  duration: { type: Number, default: 0 }, // en minutes
  mood: { type: Number, min: 1, max: 5, default: null },
  feedback: { type: String, trim: true }
}, { timestamps: true });

activitySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);