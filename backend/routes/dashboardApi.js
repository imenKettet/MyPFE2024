const express = require("express")
const router = express.Router()
const passport = require('passport')
const { dashboard } = require("../controllers/dashboard.controller")

router.get('/',
    // passport.authenticate('bearer', { session: false }),
    dashboard)

module.exports = router