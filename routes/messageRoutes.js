const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const receiverInfo = await User.findById(receiverId);

    if (!receiverInfo) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    const savedMessage = await newMessage.save();

    res.json({ message: savedMessage, receiverInfo });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


router.get('/thread-history/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  console.log('Received request with senderId:', senderId);
  console.log('Received request with receiverId:', receiverId);

  try {
    const receiverInfo = await User.findById(receiverId);

    if (!receiverInfo) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const threadHistory = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ timestamp: 'asc' })
      .exec();

    // Send the thread history and receiverInfo as a JSON response
    res.json({ threadHistory, receiverInfo });
  } catch (error) {
    console.error('Error fetching thread history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/threads/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user information for the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aggregate messages to find unique threads based on participants
    const threads = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: user._id },
            { receiver: user._id },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', user._id] },
              then: '$receiver',
              else: '$sender',
            },
          },
          lastMessage: { $last: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$lastMessage' },
      },
      {
        $lookup: {
          from: 'users', // Name of the users collection
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiverInfo',
        },
      },
      {
        $unwind: '$receiverInfo',
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    res.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;