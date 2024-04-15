const User = require("../models/user");
const Team = require('../models/team')
const Task = require('../models/task')

exports.findTeamByChef = async (req, res) => {
    try {
        const team = await Team.findOne({ chef: req.user._id }).populate('employees').populate({ path: 'projects', populate: 'tasks' })
        res.json({ employees: team.employees, projects: team.projects })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "erreur serveur" })
    }
}

exports.affectTaskToEmployee = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $push: { tasks: req.body.tasksId } })
        await Promise.all(req.body.tasksId.map(async (task) => {
            await Task.findByIdAndUpdate(task, { $set: { user: req.params.id } })
        }))
        res.json({ message: `Task${req.body.tasksId.length > 1 ? 's' : ''} affected successfully` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "erreur serveur" })
    }
}