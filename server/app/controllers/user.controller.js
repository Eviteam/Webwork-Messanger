const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const webWorkService = require("../services/web-work.service")

// GET ALL USERS
router.get(`/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    data ? res.send(data) : res.status(404).send('Not found');
  })
  // connect.then(db => {
  //   UserSchema.find({ team_id }).then(users => res.send(users))
  // })
})

// GET SINGLE USER
router.get(`/single_user/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  webWorkService.getTeamData(user_id).then(data => {
    const singleUser = data.team.users.find(user => user.id == user_id);
    singleUser ? res.send(singleUser) : res.status(404).send('Not found');
  })
  // connect.then(db => {
  //   UserSchema.find({ id }).then(user => res.send(user));
  // })
})

module.exports = router