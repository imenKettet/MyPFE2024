const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const Team = require('../models/team');
const Absence = require('../models/absence_sheet');

exports.dashboard = async (req, res) => {
    try {
        const users = await User.countDocuments() - 1;
        const employees = await User.countDocuments({ role: 'employe' });
        const chefs = await User.countDocuments({ role: 'chef' });
        const usersWithTeam = await User.countDocuments({ team: { $exists: true } });
        const projects = await Project.countDocuments();
        const teams = await Team.countDocuments();
        const projectsFinished = await Project.countDocuments({ status: 'Terminé' });
        const tasks = await Task.countDocuments();
        const tasksFinished = await Task.countDocuments({ Status: 'Terminé' });
        res.json({ users, usersWithTeam, teams, employees, chefs, projects, projectsFinished, tasks, tasksFinished })
    } catch (error) {
        res.status(500).json({ message: error.message || "error server" });
    }
}