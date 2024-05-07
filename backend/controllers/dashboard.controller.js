const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");

exports.dashboard = async (req, res) => {
  try {
    const users = (await User.countDocuments()) - 1;
    const employees = await User.countDocuments({ role: "employe" });
    const chefs = await User.countDocuments({ role: "chef" });
    const usersWithTeam = await User.countDocuments({
      team: { $exists: true },
    });
    const teams = await Team.countDocuments();
    const teamsAndTheirProjects = await Team.find();
    const projects = await Project.countDocuments();
    const projectsNotStarted = await Project.countDocuments({
      status: "En attente",
    });
    const projectsInProgress = await Project.countDocuments({
      status: "En cours",
    });
    const projectsFinished = await Project.countDocuments({
      status: "Terminé",
    });
    const tasks = await Task.countDocuments();
    const tasksNotStarted = await Task.countDocuments({ Status: "En attente" });
    const tasksInProgress = await Task.countDocuments({ Status: "En cours" });
    const tasksFinished = await Task.countDocuments({ Status: "Terminé" });
    const projectsWithTotalWorkedTime = await Project.find({
      status: "Terminé",
    }).populate("tasks");

    // Calculate total worked time for each project
    const projectsWithWorkedTime = projectsWithTotalWorkedTime.map(
      (project) => {
        const tasksWithTime = project.tasks.map((task) => {
          let totalWorkedTime = 0;
          if (task.Status === "Terminé") {
            task.worked.forEach((work) => {
              const [startHour, startMinute] = work.startTime
                .split(":")
                .map(Number);
              const [endHour, endMinute] = work.endTime.split(":").map(Number);
              const startTimeInMinutes = startHour * 60 + startMinute;
              const endTimeInMinutes = endHour * 60 + endMinute;
              totalWorkedTime += endTimeInMinutes - startTimeInMinutes;
            });
          }
          return {
            nameTask: task.nameTask,
            timeSpent: totalWorkedTime / 60, // Convert minutes to hours
            estimatedTime: task.estimatedDuration,
          };
        });
        return {
          _id: project._id,
          nameProject: project.nameProject,
          tasks: tasksWithTime,
        };
      }
    );
    console.log(projectsWithWorkedTime);

    res.json({
      users,
      usersWithTeam,
      teams,
      teamsAndTheirProjects,
      employees,
      chefs,
      projects,
      projectsNotStarted,
      projectsInProgress,
      projectsFinished,
      tasks,
      tasksNotStarted,
      tasksInProgress,
      tasksFinished,
      projectsWithWorkedTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
