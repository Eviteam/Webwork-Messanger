const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");
const Global_UserSchema = require("../models/Global_UserSchema");

// GET SINGLE TEAM
router.get(`/:user_id/:team_id`, (req, res) => {
  const team_id = req.params.team_id;
  const user_id = req.params.user_id;
  connect.then(db => {
    TeamSchema.find({ team_id }).then(team => {
      const teamUsers = team[0].users.map(user => user.id)
      teamUsers.includes(user_id)
        ? res.send({ 'team': team, 'user_id': user_id })
        : res.status(404).send("Team not found")

    })
  })
});

// CREATE TEAM
router.post(`/create-team`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newTeam = new TeamSchema(data);
    newTeam.save();
  });
  res.json({ data });
});

module.exports = router;