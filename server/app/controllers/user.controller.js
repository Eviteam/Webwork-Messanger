const express = require("express");
const router = express.Router();
const connect = require("../helpers/db");
const UserSchema = require("../models/UserSchema");

// GET ALL USERS
router.get(`/`, (req, res) => {
  connect.then(db => UserSchema.find({}).then(users => res.send(users)))
})

// GET SINGLE USER
router.get(`/:id`, (req, res) => {
  connect.then(db => {
    const id = req.params.id;
    UserSchema.find({ id }).then(user => res.send(user));
  })
})

module.exports = router