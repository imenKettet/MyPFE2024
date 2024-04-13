const Project = require("../models/project");
const Team = require("../models/team");
const Task = require("../models/task");
const User = require("../models/user");

//Add Project with associated tasks
exports.createProject = async (req, res) => {
  try {
    // Créez les tâches associées au projet
    const tasks = req.body.tasks || [];

    // Créez les tâches et récupérez leurs identifiants
    const createdTasks = await Task.insertMany(tasks);
    const taskIds = createdTasks.map((task) => task._id);

    // Créez le projet avec les identifiants de tâche associés
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

//Affiche Projects
exports.getAllProject = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks").populate("teams");
    res.json(projects);
  } catch (error) {
    error;
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get one Project from database by id
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

//Update a Project
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

//delete a Project
exports.deleteProject = async (req, res) => {
  try {
    // Récupérer le projet à supprimer
    const project = await Project.findById(req.params.id);

    // Récupérer les IDs des tâches associées au projet
    const taskIds = project.tasks.map((task) => task._id);

    // Supprimer les tâches associées au projet
    await Task.deleteMany({ _id: { $in: taskIds } });

    // Supprimer le projet lui-même
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

//affectation de projet à des  équipe
exports.affectProjectToTeam = async (req, res) => {
  try {
    console.log(req.body);
    await Promise.all(
      req.body.teams.map(async (team) => {
        await Project.findByIdAndUpdate(
          req.body.project,
          { $push: { teams: team.value } },
          { new: true }
        );
      })
    );
    //affectation meme projet a des equipes
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

//affect tasks to employe
exports.affectTasksToEmploye = async (req, res) => {
  try {
    const { employeeId, taskId } = req.body;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Recherche de la tâche par ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Affecter la tâche à l'employé
    employee.tasks.push(taskId);
    await employee.save();

    task.user = employeeId;
    await task.save();

    res.json({ message: "Affecté avec succés" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "error server" });
  }
};

//console.log(req.body);
// await Promise.all(
//   req.body.users.map(async (user) => {
//     await User.findByIdAndUpdate(
//       user.value,
//       { $push: { tasks: req.body.task } },
//       { new: true }
//     );
//   })
// );

// await Promise.all(
//   req.body.users.map(async (user) => {
//     await Task.findByIdAndUpdate(
//       req.body.task,
//       { $push: { user: user.value } },
//       { new: true }
//     );
//   })
// );
//delete
//   try {
//     await Project.findByIdAndDelete(req.params.id);
//     res.json({ message: " Le projet a été supprimé " });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "error server" });
//   }
// };
