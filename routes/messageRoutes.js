// routes/messages.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose')

// Send message
router.post('/send', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    // Check if sender and receiver are valid users
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return res.status(400).json({ error: 'Invalid sender or receiver' });
    }

    const message = await Message.create({ sender, receiver, text });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get only thread between a sender and receiver
router.get('/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Fetch messages for the specified sender and receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All messages for user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    }).populate('sender', 'username').populate('receiver', 'username').sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
