const express = require("express");
const {
  createTeam,
  getAllTeam,
  getOneTeam,
  updateTeam,
  deleteTeam,
  detailsTeam,
} = require("../controllers/team.controller");
const passport = require("passport");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  createTeam
);
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  getAllTeam
);
router.get(
  "/details",
  passport.authenticate("bearer", { session: false }),
  detailsTeam
);
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  getOneTeam
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateTeam
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deleteTeam
);

module.exports = router;
