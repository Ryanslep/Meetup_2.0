const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  blockedUsers: [
    { type: Schema.Types.ObjectId, ref: 'User' },
  ],
  fullName: {
    type: String,
    required: true,
  },
  events: [
    { type: Schema.Types.ObjectId, ref: 'Event' },
  ],
  rsvps: [
    { type: Schema.Types.ObjectId, ref: 'Event' },
  ],
  interested: [
    { type: Schema.Types.ObjectId, ref: 'Event'}
  ],
  password: {
    type: String,
  },
  profilePic: { // Add the profilePic field
    type: String,
    default: null,
  },
  preferences: {
    type: Schema.Types.ObjectId,
    ref: 'Preferences',
  },
  messages: [
    { type: Schema.Types.ObjectId, ref: 'Message' },
  ],
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain text password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
