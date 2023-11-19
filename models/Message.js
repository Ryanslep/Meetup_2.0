// models/Message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Make sure to replace 'User' with the actual model name for users
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Make sure to replace 'User' with the actual model name for users
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
