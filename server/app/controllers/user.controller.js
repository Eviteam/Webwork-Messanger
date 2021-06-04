const express = require("express");
const { groupUsers } = require("../services/user.service");
const router = express.Router();
const webWorkService = require("../services/web-work.service")

/**
 * GET ALL USERS
 * @returns void
 */
router.get(`/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    groupUsers(data.team.team_id.toString(), user_id.toString())
      .then(result => {
        result.map(item => {
          const single_user = data.team.users.find(user => +item._id === user.id);
          const shifted_user = data.team.users.splice(data.team.users.indexOf(single_user), 1)
          data.team.users.unshift(shifted_user[0]);
        })
        data ? res.send(data) : res.status(404).send('Not found');
      });
  })
})

/**
 * GET SINGLE USER
 * @returns void
 */
router.get(`/single_user/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    const singleUser = data.team.users.find(user => user.id == user_id);
    singleUser ? res.send(singleUser) : res.status(404).send('Not found');
  })
})

module.exports = router