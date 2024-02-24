const mongoose = require('mongoose');

const gptMessageSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'question is required'],
      trim: true
    },
    response: {
      type: String,
      required: [true, 'response is required'],
      trim: true
    },
  }
);

const GPTMessage = mongoose.model('GPTMessage', gptMessageSchema);
module.exports = GPTMessage;