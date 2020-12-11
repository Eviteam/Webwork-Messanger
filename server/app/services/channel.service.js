const connect = require("../helpers/db");
const https = require('https');
const ChannelSchema = require("../models/ChannelSchema");
// TODO change in prod
const BASE_URL = `${process.env.BASE_API}`;
const axios = require('axios');
const UserSchema = require("../models/UserSchema");

function createGeneralChannel(team_id) {
  connect.then(db => {
    ChannelSchema.find({ channelName: 'general' }).then(channel => {
      if (!channel.length) {
        UserSchema.find({ team_id }).then(users => {
          axios
            .post(`${BASE_URL}/api/channel/create-channel`, {
              channelName: 'general',
              users: users,
              teamId: team_id,
              isGlobal: true
            })
        })
      }
    })
  })
}

module.exports = {
  createGeneralChannel
}