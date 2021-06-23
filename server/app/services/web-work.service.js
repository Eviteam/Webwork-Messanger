const https = require('https');
const webworkApi = `${process.env.WEBWORK_BASE_URL}/chat-api/users`;

async function getTeamData(user_id) {
  return new Promise((resolve, reject) => {
    https.get(`${webworkApi}?user_id=${user_id}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const team = JSON.parse(data);
          team.user_id = user_id;
          const newTeam = { team, user_id };
          resolve(newTeam)
        } catch (e) {
          console.log(e)
        }
      });
    })
  })
}

module.exports = {
  getTeamData
}
