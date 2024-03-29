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
const directoryPath = path.join(__dirname, '../../uploads');
const md5 = require('md5');

// GET CHAT MESSAGES
router.get(`/:team_id/:user_id/:receiver_id`, (req, res) => {
  const team_id = req.params.team_id;
  const user_id = req.params.user_id;
  const receiver_id = req.params.receiver_id;
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  connect.then(db => {
    webWorkService.getTeamData(user_id).then(data => {
      const singleUser = data.team.users.find(user => user.id == user_id);
      ChatSchema.find({
        team_id
      }).then(messages => {
        const allMessages = [];
        let result = [];
        messages.map(message => {
          if ((singleUser.id.toString() == message.sender[0].id.toString() && receiver_id.toString() == message.receiver_id.toString()) ||
            (singleUser.id.toString() == message.receiver_id.toString() && receiver_id.toString() == message.sender[0].id.toString())) {
            allMessages.unshift(message);
            result = allMessages.slice(startIndex, endIndex)
          }
        })
        res.send(result.reverse())
      })
    })
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
        data.sender_id = singleUser.id
        if (!data.isSeen) {
          data.isSeen = false;
        }
        const chatSchema = new ChatSchema(data);
        chatSchema.save();
        res.json({
          data
        });
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
    res.json({
      data
    });
  })
});


// UPLOAD FILE
router.post(`/uploadFile/:team_id/:receiver_id`, uploadedFile.single('file'), uploadFile);

function uploadFile(req, res) {
  const fileData = req.file;
  !fileData
    ?
    res.status(400).json({
      message: 'No file is available!'
    }) :
    res.status(200).json({
      message: 'File is uploaded',
      uploaded: req.file.length,
      fileData
    });
};

// DELETE UPLOADED FILE
router.post(`/uploadedFile`, (req, res) => {
  const filePath = req.body.filePath;
  fs.unlink(`${filePath}`, function (err) {
    err ? res.status(404).send(err) : res.status(200).send({
      message: 'Success'
    })
  });
})

// GET TEAM'S UNSEEN MESSAGES
router.get(`/unseen/messages/:team_id/:user_id`, (req, res) => {
  const team_id = req.params.team_id;
  const user_id = req.params.user_id;
  const unseenMsgs = {}
  connect.then(db => {
    if (team_id == 0) {
      ChatSchema.find({
          receiver_id: user_id,
          isSeen: false
        })
        .then(data => {
          res.json({
            messageCount: data.length
          })
        })
    } else {
      ChatSchema.find({
          team_id,
          receiver_id: user_id,
          isSeen: false
        })
        .then(data => {
          data.map(item => {
            if (unseenMsgs && !unseenMsgs[item.sender[0].id]) {
              unseenMsgs[item.sender[0].id] = 1
              unseenMsgs['team_id'] = team_id
            } else {
              unseenMsgs[item.sender[0].id]++
              unseenMsgs['team_id'] = team_id
            }
          })
          res.json(unseenMsgs)
        })
    }
  })
})

// SET MESSAGES SEEN
router.put(`/messages/seen/:team_id/:user_id/:sender_id`, (req, res) => {
  const team_id = req.params.team_id;
  const user_id = req.params.user_id;
  const sender_id = req.params.sender_id;
  connect.then(db => {
    ChatSchema.updateMany({
      team_id,
      isSeen: false,
      receiver_id: user_id,
      sender_id
    }, {
      $set: {
        isSeen: true
      }
    }, {
      upsert: false
    }).then(data => {
      res.json(data).status(200)
    }).catch(err => res.status(400).json({
      message: err
    }))
  })
})

 //    DOWNLOAD IMAGE FROM CHAT-HISTORY

router.post(`/downloadFile`, (req, res) => {
  const filepath = req.body.params
  const num = filepath.indexOf('uploads')
  const direction = filepath.substring(num)
  const lastSlashIndex = direction.lastIndexOf('\\');
  const directoryPath = direction.substring(lastSlashIndex, 0)
  const fileName = direction.slice(lastSlashIndex + 1);
  res.sendFile(`${fileName}`, { root: path.join(__dirname, `../../${directoryPath}`) });

})


module.exports = router

