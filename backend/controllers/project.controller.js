const Project = require("../models/project");
const Team = require("../models/team");
const Task = require("../models/task");
const User = require("../models/user");

// //Add Project with associated tasks
// exports.createProject = async (req, res) => {
//   try {
//     const tasks = req.body.tasks || [];
//     const createdTasks = await Task.insertMany(tasks);
//     const taskIds = createdTasks.map((task) => task._id);
//     const project = await Project.create({ ...req.body, tasks: taskIds });
//     taskIds.map(async (id) => {
//      await Task.findByIdAndUpdate(id, { project: project._id }, { new: true });
//      });
//     res.json({ message: "Projet créé avec succès!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: error.message || "Erreur lors de la création du projet.",
//     });
//   }
// };

// Add Project with associated tasks
exports.createProject = async (req, res) => {
  try {
    const nameProject = req.body.nameProject;
    const dateStart = req.body.dateStart;
    const dateEnd = req.body.dateEnd;

    // Vérifiez si un projet avec le même nom, la même date de début et la même date de fin existe déjà
    const existingProject = await Project.findOne({
      nameProject,
      dateStart,
      dateEnd,
    });
    if (existingProject) {
      return res.status(400).json({
        message:
          "Un projet avec ce nom, cette date de début et cette date de fin existe déjà.",
      });
    }

    // Créez les tâches associées
    const tasks = req.body.tasks || [];
    const createdTasks = await Task.insertMany(tasks);
    const taskIds = createdTasks.map((task) => task._id);

    // Créez le projet avec les IDs des tâches
    const project = await Project.create({ ...req.body, tasks: taskIds });

    // Mettez à jour les tâches avec l'ID du projet
    await Promise.all(
      taskIds.map((id) =>
        Task.findByIdAndUpdate(id, { project: project._id }, { new: true })
      )
    );

    // Envoyer la réponse après avoir créé le projet et mis à jour les tâches
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
    const projects = await Project.find()
      .populate({ path: "tasks", populate: "user" })
      .populate("teams");
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
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const taskIds = project.tasks.map((task) => task._id.toString());
    const receivedTasks = req.body.tasks.filter((task) => task._id);
    const receivedTaskIds = receivedTasks.map((task) => task._id);

    const tasksToDelete = taskIds.filter(
      (taskId) => !receivedTaskIds.includes(taskId)
    );

    const newTasks = req.body.tasks.filter((task) => !task._id);

    // Supprimer les tâches non présentes dans la nouvelle liste
    await Task.deleteMany({ _id: { $in: tasksToDelete } });

    // Mettre à jour les tâches existantes
    for (const task of receivedTasks) {
      await Task.findByIdAndUpdate(task._id, {
        nameTask: task.nameTask,
        estimatedDuration: task.estimatedDuration,
      });
    }

    // Ajouter les nouvelles tâches
    const insertedNewTasks = await Task.insertMany(newTasks);
    const newTaskIds = insertedNewTasks.map((task) => task._id);

    // Mettre à jour le projet avec les nouvelles informations
    project.nameProject = req.body.nameProject;
    project.client = req.body.client;
    project.dateStart = req.body.dateStart;
    project.dateEnd = req.body.dateEnd;
    project.tasks = receivedTaskIds.concat(newTaskIds);

    await project.save();

    res.json({ message: "Le projet a été modifié", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Erreur lors de la mise à jour du projet.",
    });
  }
};

// exports.updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     let taskIds = project.tasks.map((task) => task._id.toString());
//     const receivedTaskIds = req.body.tasks
//       .map((task) => {
//         if (task._id !== undefined) {
//           return task._id;
//         } else return null;
//       })
//       .filter((task) => task !== null);
//     const tasksToDelete = taskIds.filter(
//       (taskId) => !receivedTaskIds.includes(taskId)
//     );
//     let newTasks = req.body.tasks
//       .map((task) => {
//         if (task._id === undefined) {
//           return task;
//         } else return null;
//       })
//       .filter((task) => task !== null);

//     await Task.deleteMany({ _id: { $in: tasksToDelete } });
//     tasksToDelete.map(async (id) => {
//       await Project.findByIdAndUpdate(req.params.id, {
//         $pull: { tasks: id },
//       });
//     });
//     if (newTasks.length > 0) {
//       const insertedNewTasks = await Task.insertMany(newTasks);
//       let newIds = insertedNewTasks.map((task) => task._id);
//       newIds.map(async (id) => {
//         await Task.findByIdAndUpdate(
//           id,
//           { project: req.params.id },
//           { new: true }
//         );
//       });
//       newIds.map(async (id) => {
//         await Project.findByIdAndUpdate(
//           req.params.id,

//           { $push: { tasks: id } },
//           { new: true }
//         );
//       });
//     }
//     await Project.findByIdAndUpdate(
//       req.params.id,

//       {
//         nameProject: req.body.nameProject,
//         client: req.body.client,
//         dateStart: req.body.dateStart,
//         dateEnd: req.body.dateEnd,
//       },
//       { new: true }
//     );

//     res.json({ message: " Le projet a été modifié" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: error.message || "Erreur lors de la mise à jour du projet.",
//     });
//   }
// };

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const taskIds = project.tasks.map((task) => task._id);
    const users = await User.find();
    await Promise.all(
      users.map(async (user) => {
        await User.findByIdAndUpdate(
          user._id,
          { $pull: { tasks: { $in: taskIds } } },
          { new: true }
        );
      })
    );
    const teams = await Team.find();
    await Promise.all(
      teams.map(async (team) => {
        await Team.findByIdAndUpdate(
          team._id,
          { $pull: { projects: req.params.id } },
          { new: true }
        );
      })
    );
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
    const project = await Project.findById(req.body.project);
    const assignedTeams = project.teams.filter((team) =>
      req.body.teams.some(
        (selectedTeam) => selectedTeam.value === team.toString()
      )
    );
    if (assignedTeams.length > 0) {
      const affectedTeamLabels = assignedTeams
        .map(
          (team) =>
            req.body.teams.find(
              (selectedTeam) => selectedTeam.value === team.toString()
            ).label
        )
        .join(", ");
      return res.status(400).json({
        message: `Le projet est déjà attribué à l'équipe(s) : ${affectedTeamLabels}`,
      });
    }
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
    console.log(req.body);

    res.json({ message: "Affecté avec succés" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "error server" });
  }
};
