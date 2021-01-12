const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const Global_UserSchema = require("../models/Global_UserSchema");
const channelService = require('../services/channel.service');
const https = require('https');
const userService = require("../services/user.service");
const webworkApi = `${process.env.WEBWORK_BASE_URL}/chat-api/users`;
const TeamSchema = require("../models/TeamSchema");

router.post(`/:id`, (req, res) => {
  const user_id = req.params.id;
  getTeamData(user_id).then(team => {
    connect.then(db => {
      Global_UserSchema.find({ user_id }).then(currentUser => {
        if (!currentUser.length) {
          const user = Global_UserSchema({ user_id })
          user.save();
        }
        res.json(team)
      })
    })
  })
})

function getTeamData(user_id) {
  return new Promise((resolve, reject) => {
    https.get(`${webworkApi}?user_id=${user_id}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const newTeamData = JSON.parse(data);
        newTeamData.user_id = user_id;
        const team_id = newTeamData.team_id;
        // userService.createUser(newTeamData);
        channelService.createGeneralChannel(team_id, newTeamData);
        const teamSchema = TeamSchema.find({ team_id }).then(team => {
          const newTeam = { team, user_id }
          // const newTeamSchema = new TeamSchema(newTeam);
          // console.log(newTeamSchema, 11)
          return newTeam
        })
        resolve(teamSchema.then(data => data))
      });
    })
  })
}

module.exports = router