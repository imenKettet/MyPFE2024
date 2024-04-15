const express = require("express")
const router = express.Router()
const passport = require('passport')
const { findTeamByChef, affectTaskToEmployee } = require("../controllers/chef.controller")

router.get('/my-team/:id', passport.authenticate('bearer', { session: false }), findTeamByChef)
router.put('/affect-tasks/:id', passport.authenticate('bearer', { session: false }), affectTaskToEmployee)

module.exports = router