const express = require("express");
const multer = require('multer');
const UploadedFileSchema = require("../models/UploadedFileSchema");
const app = express();
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  }, 
  filename: function (req, file, cb) {
    const filePath = `${Date.now()}-${file.originalname}`
    const uploadedFileSchema = new UploadedFileSchema({filePath});
    uploadedFileSchema.save().then(() => {
      cb(null, filePath)
    })
  }
});

const uploadedFile = multer({ storage });

module.exports = uploadedFile