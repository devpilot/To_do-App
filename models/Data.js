const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    required: true,
    default: false
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('tasks', taskSchema);
