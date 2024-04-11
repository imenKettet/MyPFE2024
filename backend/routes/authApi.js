const express = require("express");
const {
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/", loginUser);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
