const express = require("express")
const router = express.Router()
const passport = require('passport')
const { getAllNotifications, readAllNotifications, readOneNotification } = require("../controllers/notifications.controller")

router.get('/', passport.authenticate('bearer', { session: false }), getAllNotifications)
router.get('/read', passport.authenticate('bearer', { session: false }), readAllNotifications)
router.put('/read/:id', passport.authenticate('bearer', { session: false }), readOneNotification)

module.exports = router