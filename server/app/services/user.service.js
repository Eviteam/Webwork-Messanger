const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");

function createUser(newTeamData) {
  connect.then(db => {
    TeamSchema.find({team_id: newTeamData.team_id}).then(team => {
      if (!team.length) {
        const newTeam = new TeamSchema(newTeamData);
        newTeam.save();
        newTeamData.users.map(user => {
          user.team_id = newTeamData.team_id;
          const newUsers = new UserSchema(user);
          newUsers.save();
        });
      } else {
        newTeamData.users.map(user => {
          UserSchema.find({id: user.id}).then(singleUser => {
          user.team_id = newTeamData.team_id;
           if (!singleUser.length) {
              const newUser = new UserSchema(user);
              newUser.save();
            }
          })
        })
      }
      return team;
    });
  }).catch(err => console.log(err))
}

module.exports = {
  createUser
}