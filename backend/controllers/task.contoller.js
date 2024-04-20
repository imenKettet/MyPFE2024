const Task = require("../models/task");

//Add Task
exports.createTask = async (req, res) => {
  try {
    await Task.create(req.body);
    res.json({ message: " tache créé!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//Affiche tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get one task from database by id
exports.getOneTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//Update a task
exports.updateTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json(" La tache a été modifié");
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//delete a Project
exports.deleteTask = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json(" La tache  a été supprimé ");
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};


exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.id }).populate('user').populate('project');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.fillTask = async (req, res) => {
  try {
    const taskFound = await Task.findById(req.params.id)
    const index = taskFound.worked.findIndex((el) => el.dateWorked === req.body.dateWorked)
    if (index === -1) {
      await Task.findByIdAndUpdate(req.params.id, { $push: { worked: req.body }, $set: { Status: req.body.Status } }, { new: true });
    } else {
      await Task.findByIdAndUpdate(req.params.id, { $pull: { worked: taskFound.worked[index] } }, { new: true });
      await Task.findByIdAndUpdate(req.params.id, { $push: { worked: req.body }, $set: { Status: req.body.Status } }, { new: true });
    }
    res.json({ message: 'Tâche remplis!' });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.findDateWorked = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);
    const dateWorkedData = task.worked.find((el) => el.dateWorked === req.params.date)
    res.json(dateWorkedData);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.updateWorkedTaskByDate = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id);
    const dateWorkedData = task.worked.find((el) => el.dateWorked === req.params.date)
    res.json(dateWorkedData);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

