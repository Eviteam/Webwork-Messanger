const https = require('https');
const userService = require("./user.service");
const url = require('url');
const channelService = require('./channel.service');
const Global_UserSchema = require('../models/Global_UserSchema');
const webworkApi = `${process.env.WEBWORK_BASE_URL}/chat-api/users`;
// const parsedUrl = url.parse(webworkApi, true);
// const user_id = parsedUrl.query.user_id;

async function getTeamData() {
  Global_UserSchema.find({}).then(currentUser => {
    if (currentUser.length) {
      return new Promise((resolve, reject) => {
        https.get(`${webworkApi}?user_id=${currentUser[0].user_id}`, (res) => {
          let data = '';
      
          res.on('data', (chunk) => {
            data += chunk;
          });
      
          res.on('end', () => {
            const newTeamData = JSON.parse(data);
              newTeamData.user_id = currentUser[0].user_id;
              const team_id = newTeamData.team_id
              userService.createUser(newTeamData);
              channelService.createGeneralChannel(team_id);
              resolve(userService.teamId);
          });
        })
      });
    }
  })
}

module.exports = {
  getTeamData
}