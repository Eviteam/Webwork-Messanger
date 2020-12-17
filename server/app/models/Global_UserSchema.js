const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalUser = new Schema({
  user_id: {
      type: String
  }
}, {
  versionKey: false
})

module.exports = mongoose.model('Global_User', globalUser)