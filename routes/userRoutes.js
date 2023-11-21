const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const Event = require('../models/Event'); // Import the User model
const Preferences = require('../models/Preferences');
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

// Route for user registration through form on SignIn component
router.post('/register/:username/:email/:password/:fullName', async (req, res) => {
  const { username, email, password, fullName } = req.params;
  try {
    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // Create a new user with receiveNotifications: true
    const preferences = new Preferences({ receiveNotifications: true, rsvpVisibility: true });
    await preferences.save();

    const user = new User({
      username,
      email,
      password,
      fullName,
      preferences: preferences,
      blockedUsers: [],
    });

    // Save the user
    await user.save();
    console.log('User registered');

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'User registration failed' });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedProfileData = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user properties with the provided data
    Object.keys(updatedProfileData).forEach((key) => {
      if (updatedProfileData[key] !== undefined) {
        user[key] = updatedProfileData[key];
      }
    });

    // Save the updated user
    await user.save();

    // Respond with the updated user data
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/hello', async (req, res) => {
  res.send('hello');
})

// Route for fetching user data (example)
router.get('/fetch/:userId', async (req, res) => {
  console.log
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("preferences");

    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude sensitive information like the password before sending the user data
    // const sanitizedUser = { _id: user._id, username: user.username, email: user.email };

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

//Route for fetching user by username
router.get('/fetchUsername/:username', async (req, res) => {

  try {
    const username = req.params.username;
    console.log(username);
    const user = await User.findOne({ username: username });

    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude sensitive information like the password before sending the user data
    // const sanitizedUser = { _id: user._id, username: user.username, email: user.email };

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
//delete user route
router.post('/delete-user', async (req, res) => {
  const userId = req.body.userId;

  User.findByIdAndRemove(userId, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Could not delete user' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  })
})
//update user route
router.put('/update-user', async (req, res) => {
  const userId = req.body.userId;
  const updatedData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  User.findByIdAndUpdate(userId, updatedData, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(500).json({ error: 'Could not update user' });
    } else {
      res.status(200).json(updatedUser);
    }
  })
})

// Route for user login
router.post('/login', async (req, res) => {
  console.log('loggin in')
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate("preferences");

    if (!user) {
      return res.status(401).json({ success: false, message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return res.status(200).json({ success: true, message: 'Login successful', user });
    } else {
      // If the passwords do not match
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Error Connecting to Database' });
  }
});

router.get('/myEvents/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve events for the user
    const userEvents = await Event.find({ host: userId });

    res.status(200).json(userEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/myRsvps/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve RSVPs for the user
    const userRsvps = await Event.find({ _id: { $in: user.rsvps } });

    res.status(200).json(userRsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user preferences
router.get('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.preferences) {
      // If preferences are not found, return default values
      return res.json({
        receiveNotifications: true,
        rsvpVisibility: true,
        blockedUsers: [],
      });
    }
    // If user has preferences, return them; otherwise, return an empty object
    const preferences = user.preferences ? user.preferences : {};
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or update user preferences
router.post('/preferences/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { receiveNotifications, rsvpVisibility, blockedUsers } = req.body;
    // Add more incoming preferences as needed

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if user already has preferences
    let preferences = user.preferences;



    console.log('Updating Preferences...')
    // If yes, update existing preferences
    const response = await Preferences.findByIdAndUpdate(preferences._id,
      {
        receiveNotifications: receiveNotifications,
        rsvpVisibility: rsvpVisibility,
        blockedUsers: blockedUsers
      }
    );

    await user.save();

    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error creating/updating user preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/block', async (req, res) => {
  const { userId, blockedUserId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAlreadyBlocked = user.blockedUsers.includes(blockedUserId);

    // Toggle the user's block status
    if (isAlreadyBlocked) {
      console.log('was already blocked')
      user.blockedUsers = user.blockedUsers.filter((id) => id === blockedUserId);
    } else {
      console.log('was not blocked')
      user.blockedUsers.push(blockedUserId);
    }

    await user.save();
    const action = isAlreadyBlocked ? 'unblocked' : 'blocked';

    return res.status(200).json({ message: `User ${action} successfully` });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
