const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadedFileSchema = new Schema({
  filePath: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('File', uploadedFileSchema)