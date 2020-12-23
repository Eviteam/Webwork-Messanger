const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./UserSchema')

const chatSchema = new Schema({
  receiver_id: {
    type: String
  },
  message: {
    type: String
  },
  sender: {
    type: Object
  },
  channel: {
    type: String
  },
  isSeen: {
    type: Boolean
  }
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('Chat', chatSchema)