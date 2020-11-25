const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./UserSchema')

const chatSchema = new Schema({
  userId: {
    type: String
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User'
  },
  message: {
    type: String
  },
  channel: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('ChatSchema', chatSchema)