const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const Global_UserSchema = require("../models/Global_UserSchema");

router.post(`/:id`, (req, res) => {
  const user_id = req.params.id;
  connect.then(db => {
    Global_UserSchema.find({user_id}).then(currentUser => {
      if (!currentUser.length) {
        const user = Global_UserSchema({user_id})
        user.save();
      }
      res.json({})
    })
  })
})

module.exports = router