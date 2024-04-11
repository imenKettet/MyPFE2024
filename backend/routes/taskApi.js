const express = require("express");
const {
  createTask,
  getAllTasks,
  getOneTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.contoller");
const passport = require("passport");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  createTask
);
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  getAllTasks
);
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  getOneTask
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateTask
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deleteTask
);

module.exports = router;
