const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const multer = require('multer');
const Channel_ChatSchema = require("../models/Channel_ChatSchema");
const ChatSchema = require("../models/ChatSchema");
const Global_UserSchema = require("../models/Global_UserSchema");
const TeamSchema = require("../models/TeamSchema");
const webWorkService = require("../services/web-work.service");
const uploadedFile = require("../services/chat.service");
const UploadedFileSchema = require("../models/UploadedFileSchema");
const fs = require('fs');
const path = require('path')
const directoryPath = path.join(__dirname, '../../uploads')

// GET CHAT MESSAGES
router.get(`/:team_id/:user_id/:receiver_id`, (req, res) => {
  const team_id = req.params.team_id;
  const user_id = req.params.user_id;
  const receiver_id = req.params.receiver_id;
  connect.then(db => {
    // TeamSchema.find({ team_id }).then(team => {
    //   if (!team) {
    //     res.status(404).send('Not found');
    //   } else {
        Global_UserSchema.find({}).then(currentUser => {
          if (currentUser.length) {
            webWorkService.getTeamData(user_id).then(data => {
              const singleUser = data.team.users.find(user => user.id == user_id);
              ChatSchema.find({ team_id }).then(messages => {
                const allMessages = [];
                messages.map(message => {
                  if ((singleUser.id.toString() == message.sender[0].id.toString() && receiver_id.toString() == message.receiver_id.toString())
                    || (singleUser.id.toString() == message.receiver_id.toString() && receiver_id.toString() == message.sender[0].id.toString())) {
                    allMessages.push(message);
                  }
                })
                res.send(allMessages)
              })
            })
          }
        })
    //   }
    // })
  })
})

// SEND MESSAGE TO USER
router.post(`/send-message`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const user_id = data.sender;
    const team_id = data.team_id;
    webWorkService.getTeamData(user_id).then(val => {
      if (team_id == val.team.team_id) {
        const singleUser = val.team.users.find(user => user.id == user_id);
        data.sender = [singleUser];
        if (!data.isSeen) {
          data.isSeen = false;
        }
        const chatSchema = new ChatSchema(data);
        chatSchema.save();
        res.json({ data });
      }
    })
  })
});

// SEND MESSAGE TO CHANNEL
router.post(`/send-message/channel`, (req, res) => {
  const data = req.body;
  webWorkService.getTeamData(data.user_id).then(val => {
    const singleUser = val.team.users.find(user => user.id == data.user_id);
    data.sender = [singleUser]
    const channelMessages = new Channel_ChatSchema(data);
    channelMessages.save();
    res.json({ data });
  })
});


// UPLOAD FILE
router.post(`/uploadFile`, uploadedFile.single('file'), uploadFile);
function uploadFile(req, res) {
  const fileData = req.file;
  !fileData
    ? res.status(400).json({ message: 'No file is available!' }) 
    : res.status(200).json({ message: 'File is uploaded', uploaded: req.file.length, fileData });
};

// DELETE UPLOADED FILE
router.delete(`/uploadedFile/:fileName`, (req, res) => {
  const fileName = req.params.fileName;
  fs.unlink(`${directoryPath}/${fileName}`, function(err) {
    err ? res.status(404).send(err) : res.status(200).send({message: 'Success'})
  });
})

module.exports = router