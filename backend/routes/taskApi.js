const express = require("express");
const {
  createTask,
  getAllTasks,
  getOneTask,
  updateTask,
  deleteTask,
  getMyTasks,
  fillTask,
  findDateWorked,
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
router.get(
  "/date-worked/:id/:date",
  passport.authenticate("bearer", { session: false }),
  findDateWorked
);
router.get(
  "/my-tasks/:id",
  passport.authenticate("bearer", { session: false }),
  getMyTasks
);
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateTask
);

router.put(
  "/fill-task/:id",
  passport.authenticate("bearer", { session: false }),
  fillTask
);
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  deleteTask
);

module.exports = router;
