// const { time } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({

    eventName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },    
    endTime: {
        type: Date,
        required: true
    },    
    address: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [
        { type: String } // Keep it as an array of strings
    ],
    rsvps: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    interested: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    reports: [
        {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            reason: String,
          },
    ],
    pictures: [
        {
          type: String, // Assuming the URIs are stored as strings
        },
      ],
    status: {type: String, required: false}
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;