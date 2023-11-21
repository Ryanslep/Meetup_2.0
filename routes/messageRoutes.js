const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send Message
router.post('/send', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    const message = await Message.create({ sender, receiver, text });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch Message History
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes (upload media, fetch media, fetch location) can be added similarly.

module.exports = router;
