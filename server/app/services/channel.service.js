const connect = require("../helpers/db");
const https = require('https');
const ChannelSchema = require("../models/ChannelSchema");
// TODO change in prod   'http://localhost:3000' ||
const BASE_URL = 'http://localhost:3000' || `${process.env.BASE_API}`;
const axios = require('axios');
const UserSchema = require("../models/UserSchema");

function createGeneralChannel(team_id, newTeamData) {
  connect.then(db => {
    ChannelSchema.find({ channelName: 'general', teamId: team_id }).then(channel => {
      if (!channel.length) {
        // UserSchema.find({ team_id }).then(users => {
          axios
            .post(`${BASE_URL}/api/channel/create-channel`, {
              channelName: 'general',
              users: newTeamData.team.users,
              teamId: team_id,
              isGlobal: true
            })
        // })
      }
    })
  })
}

module.exports = {
  createGeneralChannel
}