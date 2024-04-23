const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const Team = require('../models/team');

exports.dashboard = async (req, res) => {
    try {
        const users = await User.countDocuments() - 1;
        const employees = await User.countDocuments({ role: 'employe' });
        const chefs = await User.countDocuments({ role: 'chef' });
        const usersWithTeam = await User.countDocuments({ team: { $exists: true } });
        const teams = await Team.countDocuments();
        const teamsAndTheirProjects = await Team.find()
        const projects = await Project.countDocuments();
        const projectsNotStarted = await Project.countDocuments({ status: 'En attente' });
        const projectsInProgress = await Project.countDocuments({ status: 'En cours' });
        const projectsFinished = await Project.countDocuments({ status: 'Terminé' });
        const tasks = await Task.countDocuments();
        const tasksNotStrated = await Task.countDocuments({ Status: 'En attente' });
        const tasksInProgress = await Task.countDocuments({ Status: 'En cours' });
        const tasksFinished = await Task.countDocuments({ Status: 'Terminé' });
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
            tasksNotStrated,
            tasksInProgress,
            tasksFinished,

        })
    } catch (error) {
        res.status(500).json({ message: error.message || "error server" });
    }
}