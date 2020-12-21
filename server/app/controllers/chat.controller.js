const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const Channel_ChatSchema = require("../models/Channel_ChatSchema");
const ChatSchema = require("../models/ChatSchema");
const Global_UserSchema = require("../models/Global_UserSchema");
const TeamSchema = require("../models/TeamSchema");
const UserSchema = require("../models/UserSchema");

// GET CHAT MESSAGES
router.get(`/:team_id/:user_id/:receiver_id`, (req, res) => {
  const user_id = req.params.user_id;
  const team_id = req.params.team_id;
  const receiver_id = req.params.receiver_id;
  connect.then(db => {
    TeamSchema.find({ team_id }).then(data => {
      if (!data) {
        res.status(404).send('Not found');
      } else {
        Global_UserSchema.find({}).then(currentUser => {
          if (currentUser.length) {
            UserSchema.find({ id: user_id }).then(user => {
              ChatSchema.find({}).then(messages => {
                const allMessages = [];
                messages.map(message => {
                  if ((user[0]._id.toString() == message.sender._id.toString() && receiver_id.toString() == message.receiver_id.toString())
                    || (user[0]._id.toString() == message.receiver_id.toString() && receiver_id.toString() == message.sender._id.toString())) {
                    allMessages.push(message);
                  }
                })
                res.send(allMessages)
              })
            })
          }
        })
      }
    })
  })
})

// SEND MESSAGE TO USER
router.post(`/send-message`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const user_id = data.sender;
    UserSchema.findById(user_id).then(user => {
      data.sender = user;
      const chatSchema = new ChatSchema(data);
      chatSchema.save();
      res.json({ data });
    })
  })
});

// SEND MESSAGE TO CHANNEL
router.post(`/send-message/channel`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    UserSchema.findById(data.user_id).then(user => {
      data.sender = user
      const channelMessages = new Channel_ChatSchema(data);
      channelMessages.save();
      res.json({ data });
    })
  })
})

module.exports = router