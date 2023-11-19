const mongoose = require('mongoose');

const tag = new mongoose.Schema({
    tagName:{
        type:String,
        required: true,
        unique: true
    }
})

const Tag = mongoose.model('Tag', tag);

module.exports = Tag;