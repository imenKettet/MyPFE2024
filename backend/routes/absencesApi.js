const express = require("express");
const {
  createAbsence,
  getAllAbsences,
  getOneAbsence,
  updateAbsence,
  deletetAbsence,
} = require("../controllers/absences.controller");
const passport = require("passport");

const router = express.Router();
router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  createAbsence
);
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  getAllAbsences
);
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  getOneAbsence
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateAbsence
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deletetAbsence
);
module.exports = router;
