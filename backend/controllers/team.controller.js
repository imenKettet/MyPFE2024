const Team = require("../models/team");
const User = require("../models/user");
const Project = require("../models/project");

//Add team
exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    req.body.employees.map(async (id) => {
      await User.findByIdAndUpdate(id, { team: team._id }, { new: true });
    });
    await User.findByIdAndUpdate(
      req.body.chef,
      { team: team._id },
      { new: true }
    );
    res.json({ message: "L'équipe a été créé!" });
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
    let employees = [];
    team.employees.map((em) => {
      employees.push({
        value: em._id,
        label: em.firstName + " " + em.lastName,
      });
    });
    // team.employees = teamIds;
    const chef = {
      value: team.chef._id,
      label: team.chef.firstName + " " + team.chef.lastName,
    };
    res.json({ team, teamName: team.teamName, employees, chef });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
// //Update a Team
// exports.updateTeam = async (req, res) => {
//   try {
//     await Team.findByIdAndUpdate(req.params.id, req.body);
//     req.body.employees.map(async (id) => {
//       await User.findByIdAndUpdate(id, { team: req.params.id }, { new: true });
//     });
//     res.json({ message: " L'équipe a été modifié" });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "error server" });
//   }
// };
// Update team
exports.updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { employees, chef } = req.body;

    // Trouver l'équipe existante
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Equipe non trouvée" });
    }

    // Trouver les utilisateurs qui font actuellement partie de l'équipe
    const currentEmployees = await User.find({ team: teamId });

    // Trouver les utilisateurs qui ne sont plus dans la liste des employés
    const removedEmployees = currentEmployees.filter(
      (user) => !employees.includes(user._id.toString())
    );

    // Mettre à jour les informations de l'équipe
    team.set(req.body);
    await team.save();

    // Mettre à jour les utilisateurs nouvellement ajoutés
    const employeeUpdates = employees.map((id) =>
      User.findByIdAndUpdate(id, { team: teamId }, { new: true })
    );

    // Supprimer l'ID de l'équipe des utilisateurs retirés
    const removeTeamFromUsers = removedEmployees.map((user) =>
      User.findByIdAndUpdate(user._id, { $unset: { team: "" } }, { new: true })
    );

    // Mettre à jour le chef de l'équipe
    employeeUpdates.push(
      User.findByIdAndUpdate(chef, { team: teamId }, { new: true })
    );

    // Attendre que toutes les mises à jour soient terminées
    await Promise.all([...employeeUpdates, ...removeTeamFromUsers]);

    res.json({ message: "L'équipe a été mise à jour!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};
//delete a team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    await User.findByIdAndUpdate(
      team.chef,
      { $unset: { team: 1 } },
      { new: true }
    );
    await Promise.all(
      team.employees.map(async (employeeId) => {
        await User.findByIdAndUpdate(
          employeeId,
          { $unset: { team: 1 } },
          { new: true }
        );
      })
    );
    const projects = await Project.find();
    await Promise.all(
      projects.map(async (project) => {
        await Project.findByIdAndUpdate(
          project._id,
          { $pull: { teams: req.params.id } },
          { new: true }
        );
      })
    );
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
