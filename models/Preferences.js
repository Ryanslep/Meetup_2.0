// preferencesModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferencesSchema = new mongoose.Schema({
  receiveNotifications: {
    type: Boolean,
    default: true, // You can set a default value
  },
  rsvpVisibility: {
    type: Boolean,
    default: true, // You can set a default value
  },
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;