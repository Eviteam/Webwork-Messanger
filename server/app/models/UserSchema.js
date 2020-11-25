const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  teamId: {
    type: Number
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }],
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)