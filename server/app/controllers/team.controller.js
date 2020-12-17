const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");
const TeamSchema = require("../models/TeamSchema");
const Global_UserSchema = require("../models/Global_UserSchema");

// GET SINGLE TEAM
router.get(`/:id`, (req, res) => {
  const id = req.params.id;
  connect.then(db => {
    TeamSchema.find({ team_id: id }).then(team => {
      Global_UserSchema.find({}).then(currentUser => {
        if (currentUser.length) {
          console.log(currentUser, "444")
          res.send({'team': team, 'user_id' : currentUser[0].user_id})
        }
      })
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