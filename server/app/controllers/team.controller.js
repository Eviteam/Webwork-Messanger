const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");

// GET SINGLE TEAM
router.get(`/:id`, (req, res) => {
  const id = req.params.id;
  connect.then(db => {
    TeamSchema.find({ team_id: id }).then(team => {
      console.log(team, "team")
      res.send(team)
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