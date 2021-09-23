const express = require("express");
const multer = require('multer');
const fs = require('fs');
const UploadedFileSchema = require("../models/UploadedFileSchema");
const app = express();
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const date = formatDate(new Date());
    const path = `./uploads/${req.params.team_id}/${date}/${req.params.receiver_id}`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  }, 
  filename: function (req, file, cb) {
    const filePath = `${Date.now()}-${file.originalname}`
    const uploadedFileSchema = new UploadedFileSchema({filePath});
    uploadedFileSchema.save().then(() => {
      cb(null, filePath)
    })
  }
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const uploadedFile = multer({ storage });

module.exports = uploadedFile
