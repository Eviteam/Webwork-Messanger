const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const ChannelSchema = require("../models/ChannelSchema");
const UserSchema = require("../models/UserSchema");
const Channel_ChatSchema = require("../models/Channel_ChatSchema");
const TeamSchema = require("../models/TeamSchema");

// GET CHANNELS 
router.get(`/:teamId`, (req, res) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;
  connect.then(db => {
    ChannelSchema.find({ teamId }).then(channel => {
      channel = channel.filter(item => item.isGlobal);
      channel ? res.send(channel) : res.status(404).send('Not found');
    });
  });
});

// TODO
// GET SINGLE CHANNEL
// router.get(`/:teamId/:userId`, (req, res) => {
//   const userId = req.params.userId;
//   const teamId = req.params.teamId;
//   const data = {};
//   connect.then(db => {
//     UserSchema.findById(userId).populate('channels').then(users => {
//       data.privateChannels = users.channels.filter(item => {
//         if (item.teamId === teamId && item.isGlobal === false) {
//           return item
//         }
//       });
//       data.globalCHannels = users.channels.filter(item => {
//         if (item.isGlobal && item.teamId === teamId) {
//           return item
//         }
//       })
//       data ? res.send(data) : res.status(404).send('Not found');
//     })
//   })
// });

// GET CHANNEL MESSAGES
router.get(`/message/:team_id`, (req, res) => {
  const team_id = req.params.team_id;
  connect.then(db => {
    Channel_ChatSchema.find({ team_id }).then(data => {
      res.send(data);
    })
  })
})


// CREATE CHANNEL
router.post(`/create-channel`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newChannel = new ChannelSchema(data);
    newChannel.save();
    newChannel.users.map(user => {
      UserSchema.findById(user).then(res => {
        if (!res.channels.includes(newChannel._id)) {
          res.channels.push(newChannel._id);
        }
        const userSchema = new UserSchema(res);
        userSchema.save();
      })
    })
    res.json({ data });
  });
});

module.exports = router;