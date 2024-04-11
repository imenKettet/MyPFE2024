const express = require("express");
const {
  createProject,
  getAllProject,
  getOneProject,
  updateProject,
  deleteProject,
  affectProjectToTeam,
  affectTasksToEmploye,
} = require("../controllers/project.controller");
const passport = require("passport");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  createProject
);
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  getAllProject
);
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  getOneProject
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateProject
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deleteProject
);
router.post(
  "/affect",
  passport.authenticate("bearer", { session: false }),
  affectProjectToTeam
);
router.post(
  "/affectTasks",
  passport.authenticate("bearer", { session: false }),
  affectTasksToEmploye
);

module.exports = router;
