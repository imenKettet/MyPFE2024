const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  detailsUser,
} = require("../controllers/user.controller");
const passport = require("passport");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  createUser
);
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  getAllUsers
);
router.get(
  "/details",
  passport.authenticate("bearer", { session: false }),
  detailsUser
);
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  getOneUser
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateUser
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deleteUser
);

module.exports = router;
