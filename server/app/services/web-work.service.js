const https = require('https');
const userService = require("./user.service");
const url = require('url');
const channelService = require('./channel.service');
const webworkApi = `${process.env.WEBWORK_BASE_URL}/chat-api/users?user_id=71`;
const parsedUrl = url.parse(webworkApi, true);
const user_id = parsedUrl.query.user_id;

async function getTeamData() {
  await new Promise((resolve, reject) => {
    https.get(webworkApi, (res) => {
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        const newTeamData = JSON.parse(data);
        newTeamData.user_id = user_id;
        const team_id = newTeamData.team_id
        userService.createUser(newTeamData);
        channelService.createGeneralChannel(team_id);
        resolve(userService.teamId);
      });
    })
  });
}

module.exports = {
  getTeamData,
  user_id
}