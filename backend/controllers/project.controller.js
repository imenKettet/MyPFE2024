const Project = require("../models/project");
const Team = require("../models/team");
const Task = require("../models/task");
const User = require("../models/user");

//Add Project with associated tasks
exports.createProject = async (req, res) => {
  try {
    const tasks = req.body.tasks || [];
    const createdTasks = await Task.insertMany(tasks);
    const taskIds = createdTasks.map((task) => task._id);
    const project = await Project.create({ ...req.body, tasks: taskIds });
    taskIds.map(async (id) => {
      await Task.findByIdAndUpdate(id, { project: project._id }, { new: true });
    });
    res.json({ message: "Projet créé avec succès!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Erreur lors de la création du projet.",
    });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks").populate("teams");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("tasks")
      .populate("teams");
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    let taskIds = project.tasks.map((task) => task._id.toString());
    const receivedTaskIds = req.body.tasks
      .map((task) => {
        if (task._id !== undefined) {
          return task._id;
        } else return null;
      })
      .filter((task) => task !== null);
    const tasksToDelete = taskIds.filter(
      (taskId) => !receivedTaskIds.includes(taskId)
    );
    let newTasks = req.body.tasks
      .map((task) => {
        if (task._id === undefined) {
          return task;
        } else return null;
      })
      .filter((task) => task !== null);
    console.log({ taskIds, newTasks, receivedTaskIds, tasksToDelete });

    await Task.deleteMany({ _id: { $in: tasksToDelete } });
    tasksToDelete.map(async (id) => {
      await Project.findByIdAndUpdate(req.params.id, {
        $pull: { tasks: id },
      });
    });
    if (newTasks.length > 0) {
      const insertedNewTasks = await Task.insertMany(newTasks);
      let newIds = insertedNewTasks.map((task) => task._id);
      console.log({ insertedNewTasks });
      newIds.map(async (id) => {
        await Task.findByIdAndUpdate(
          id,
          { project: req.params.id },
          { new: true }
        );
      });
      newIds.map(async (id) => {
        await Project.findByIdAndUpdate(
          req.params.id,

          { $push: { tasks: id } },
          { new: true }
        );
      });
    }

    res.json({ message: " Le projet a été modifié" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Erreur lors de la mise à jour du projet.",
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const taskIds = project.tasks.map((task) => task._id);
    await Task.deleteMany({ _id: { $in: taskIds } });
    await Project.findByIdAndDelete(req.params.id);
    res.json({
      message:
        "Le projet et ses tâches associées ont été supprimés avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Erreur lors de la suppression du projet et de ses tâches associées.",
    });
  }
};

exports.affectProjectToTeam = async (req, res) => {
  try {
    await Promise.all(
      req.body.teams.map(async (team) => {
        await Project.findByIdAndUpdate(
          req.body.project,
          { $push: { teams: team.value } },
          { new: true }
        );
      })
    );
    await Promise.all(
      req.body.teams.map(async (team) => {
        await Team.findByIdAndUpdate(
          team.value,
          { $push: { projects: req.body.project } },
          { new: true }
        );
      })
    );

    res.json({ message: "Affecté avec succés" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "error server" });
  }
};