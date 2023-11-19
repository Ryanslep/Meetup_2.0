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
        { type: Schema.Types.ObjectId, ref: 'Tags' }
    ],
    rsvps: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    recurring: {
        type: Boolean,
        required: true,
    },
    reports: [
        {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            reason: String,
          },
    ]
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;