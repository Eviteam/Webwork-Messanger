const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const userService = require("../services/user.service");
const ChannelSchema = require("../models/ChannelSchema");
const { teamId } = require("../services/user.service");
const UserSchema = require("../models/UserSchema");

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

// GET SINGLE CHANNEL
router.get(`/:teamId/:userId`, (req, res) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  const data = {};
  connect.then(db => {
    UserSchema.findById(userId).populate('channels').then(users => {
      data.privateChannels = users.channels.filter(item => {
        if (item.teamId === teamId && item.isGlobal === false) {
          return item
        }
      });
      data.globalCHannels = users.channels.filter(item => {
        if (item.isGlobal && item.teamId === teamId) {
          return item
        }
      })
      data ? res.send(data) : res.status(404).send('Not found');
    })
  })
});

// GET CHANNEL MESSAGES
router.get(`/:channelId`, (req, res) => {
  const channelId = req.params.channelId;
  connect.then(db => {
    ChannelSchema.findById(channelId).then(data => {
      data ? res.send(data) : res.status(404).send('Not found');
    })
  })
})


// CREATE CHANNEL
router.post(`/create-channel`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newChannel = new ChannelSchema(data);
    newChannel.save();
  });
  res.json({ data });
});

module.exports = router;