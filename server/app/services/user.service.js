const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");
const webWorkService = require("./web-work.service");
const ChatSchema = require("../models/ChatSchema");

function createUser(newTeamData) {
  connect.then(db => {
    webWorkService.getTeamData(newTeamData.user_id).then(team => {
    // TeamSchema.find({team_id: newTeamData.team_id}).then(team => {
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

async function groupUsers(team_id, receiver_id) {
  const data = await ChatSchema.aggregate([
    {
      $match: { team_id, receiver_id }
    },
    {
      $sort: { isSeen: 1, updatedAt: -1 }
    },
    {
      $group: {
        _id: "$sender_id",
        updatedAt: { $first: "$updatedAt" },
        isSeen: { $first: "$isSeen" }
      }
    },
    {
      $sort: { isSeen: 1, updatedAt: -1 }
    },
  ]);
  return data.reverse();
}

module.exports = {
  createUser,
  groupUsers
}