
const https = require('https');
const userService = require("./user.service");

async function getTeamData() {
  await new Promise((resolve, reject) => {
    https.get(`${process.env.WEBWORK_BASE_URL}/chat-api/users?user_id=71`, (res) => {
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        const newTeamData = JSON.parse(data);
        userService.teamId = newTeamData.team_id;
        userService.createUser(newTeamData);
        resolve(userService.teamId);
      });
    });
  });
}

module.exports = {
  getTeamData
}