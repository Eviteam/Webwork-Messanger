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
  team_id: {
    type: Number
  },
  // TODO fix after fixing bug chat message
  // channels: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Channel'
  // }],
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)