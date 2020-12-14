const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelMessages = new Schema({
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  },
  user_id: {
    type: String
  },
  sender: {
    type: Object,
  },
  message: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('Channel_Messages', channelMessages)