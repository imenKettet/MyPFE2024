const User = require("../models/user");
const Team = require('../models/team')
const Task = require('../models/task')

exports.findTeamByChef = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const team = await Team.findById(user.team).populate({ path: 'employees', populate: 'tasks' }).populate({ path: 'projects', populate: 'tasks' })
        res.json({ employees: team.employees, projects: team.projects })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "erreur serveur" })
    }
}