const https = require('https');
const userService = require("./user.service");
const url = require('url');
const channelService = require('./channel.service');
const Global_UserSchema = require('../models/Global_UserSchema');
const webworkApi = `${process.env.WEBWORK_BASE_URL}/chat-api/users`;
// const parsedUrl = url.parse(webworkApi, true);
// const user_id = parsedUrl.query.user_id;

async function getTeamData(user_id) {
  // Global_UserSchema.find({ user_id }).then(currentUser => {
  //   if (currentUser.length) {
      // return new Promise((resolve, reject) => {
      //   https.get(`${webworkApi}?user_id=${currentUser[0].user_id}`, (res) => {
      //     let data = '';
      
      //     res.on('data', (chunk) => {
      //       data += chunk;
      //     });
      
      //     res.on('end', () => {
      //       const newTeamData = JSON.parse(data);
      //         newTeamData.user_id = currentUser[0].user_id;
      //         const team_id = newTeamData.team_id
      //         userService.createUser(newTeamData);
      //         channelService.createGeneralChannel(team_id);
      //         resolve(userService.teamId);
      //     });
      //   })
      // });
      return new Promise((resolve, reject) => {
        https.get(`${webworkApi}?user_id=${user_id}`, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const team = JSON.parse(data);
            team.user_id = user_id;
            const newTeam = { team, user_id };
            resolve(newTeam)
          });
        })
      })
}

module.exports = {
  getTeamData
}