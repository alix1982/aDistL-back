const mongoose = require('mongoose');
// const validator = require('validator');

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['successfullyPay', 'errorPay', 'default'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: null
  },
  date: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    minlength: 1,
    maxlength: 1000,
    required: true,
  },
});

module.exports = mongoose.model('feedback', feedbackSchema);
