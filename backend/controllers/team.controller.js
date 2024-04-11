const Team = require("../models/team");
const User = require("../models/user");

//Add team
exports.createTeam = async (req, res) => {
  try {
    let teamIds = [];
    req.body.employees.map((em) => {
      teamIds.push(em.value);
    });
    req.body.employees = teamIds;
    const team = await Team.create(req.body);
    teamIds.map(async (id) => {
      await User.findByIdAndUpdate(id, { team: team._id }, { new: true });
    });
    res.json({ message: "L'equipe a été créé!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get all team
exports.getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("chef")
      .populate("employees")
      .populate("projects");
    res.json(teams);
  } catch (error) {
    error;
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get one Team from database by id
exports.getOneTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("chef")
      .populate("employees")
      .populate("projects");
    let teamIds = [];
    team.employees.map((em) => {
      teamIds.push({ value: em._id, label: em.firstName + " " + em.lastName });
    });
    team.employees = teamIds;
    team.chef = {
      value: team.chef._id,
      label: team.chef.firstName + " " + team.chef.lastName,
    };
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//Update a Team
exports.updateTeam = async (req, res) => {
  try {
    let teamIds = [];
    req.body.employees.map((em) => {
      teamIds.push(em.value);
    });
    req.body.employees = teamIds;
    await Team.findByIdAndUpdate(req.params.id, req.body);
    teamIds.map(async (id) => {
      await User.findByIdAndUpdate(id, { team: req.params.id }, { new: true });
    });
    res.json(" L'équipe a été modifié");
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//delete a team
exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json(" L'équipe a été supprimé ");
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get projects and emplyees from team
exports.detailsTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ chef: req.user._id })
      .populate("employees")
      .populate({ path: "projects", populate: "tasks" });
    res.json({ employees: team.employees, projects: team.projects });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des projets de l'équipe",
      error: error.message,
    });
  }
};
