const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const ChatSchema = require("../models/ChatSchema");
const UserSchema = require("../models/UserSchema");
const { teamId } = require("../services/user.service");

// GET CHAT MESSAGES
router.get(`/:receiver_id`, (req, res) => {
  const receiver_id = req.params.receiver_id;
  connect.then(db => {
    ChatSchema.find({ receiver_id }).then(data => {
      data ? res.send(data) : res.status(404).send('Not found');
    })
  })
})

// TODO
// GET USERS
// router.get(`/users/:team_id/:user_id`, (req, res) => {
//   const user_id = req.params.user_id;
//   const team_id = req.params.team_id;
//   console.log(req.params, "788778")
//   connect.then(db => {
//     UserSchema.findById(user_id).then(user => {
//       ChatSchema.find().then(messages => {
//         console.log(user, "user");
//         res.json(user)
//       })
//     })
//   })
// });

// SEND MESSAGE
router.post(`/send-message`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const chatSchema = new ChatSchema(data);
    chatSchema.save();
  })
  res.json({ data });
})

module.exports = router