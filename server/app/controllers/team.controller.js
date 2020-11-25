const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");

// GET SINGLE TEAM
router.get(`/api/team/71`, (req, res) => {
  const id = req.params.id;
  connect.then(db => {
    UserSchema.find({}).then(users => {
      const allUsers = users.filter(user => user.teamId === id);
      TeamSchema.findById(id).then(team => {
        team.user = allUsers;
        team.save();
        res.send(team)
      })
    });
  })
});

// CREATE TEAM
router.post(`/api/create-team`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newTeam = new TeamSchema(data);
    newTeam.save();
  });
  res.json({ data });
});

module.exports = router;