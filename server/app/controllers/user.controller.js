const express = require("express");
const router = express.Router();
const webWorkService = require("../services/web-work.service")

// GET ALL USERS
router.get(`/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    data ? res.send(data) : res.status(404).send('Not found');
  })
})

// GET SINGLE USER
router.get(`/single_user/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    const singleUser = data.team.users.find(user => user.id == user_id);
    singleUser ? res.send(singleUser) : res.status(404).send('Not found');
  })
})

module.exports = router