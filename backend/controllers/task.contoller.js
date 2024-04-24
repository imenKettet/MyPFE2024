const Task = require("../models/task");
const Project = require("../models/project");

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
    let verifyTasks = true
    const taskFound = await Task.findById(req.params.id).populate({ path: 'project', populate: 'tasks' })
    if (taskFound.Status === 'En attente') {
      await Project.findByIdAndUpdate(taskFound.project._id, { $set: { status: 'En cours' } }, { new: true }).lean()
    }
    const index = taskFound.worked.findIndex((el) => el.dateWorked === req.body.dateWorked)
    if (index !== -1) {
      await Task.findByIdAndUpdate(req.params.id, { $pull: { worked: taskFound.worked[index] } }, { new: true }).lean();
    }
    await Task.findByIdAndUpdate(req.params.id, { $push: { worked: req.body }, $set: { Status: req.body.Status } }, { new: true }).lean()
    await Task.findByIdAndUpdate(req.params.id, { $set: { Status: req.body.Status } }, { new: true }).lean();
    if (taskFound.Status === 'En attente') {
      await Project.findByIdAndUpdate(taskFound.project._id, { $set: { status: 'En cours' } }, { new: true }).lean()
    }
    const newTaskArray = await Task.findById(req.params.id).populate({ path: 'project', populate: 'tasks' })
    await Promise.all(
      await newTaskArray.project.tasks.map(async (task) => {
        if (task.Status === 'En cours' || task.Status === 'En attente') {
          verifyTasks = false
        }
      })
    )
    if (verifyTasks) {
      await Project.findByIdAndUpdate(taskFound.project._id, { $set: { status: 'Terminé' } }, { new: true }).lean()
    }
    res.json({ message: 'Tâche remplis!' });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

exports.findDateWorked = async (req, res) => {
  try {
    console.log(req.params);
    const task = await Task.findById(req.params.id);
    console.log(task);
    const dateWorkedData = task.worked.find((el) => el.dateWorked === req.params.date)
    console.log(dateWorkedData);
    res.json(dateWorkedData);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
