const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const { encryptPassword } = require("../common/utils");
const nodemailer = require("nodemailer");

//Add User
exports.createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email,
    });
    //check if user exists
    if (user) {
      return res.status(400).json({
        message: " Utilisateur déja existe",
      });
    } else {
      const encryptedPassword = await encryptPassword(req.body.password);
      req.body.password = encryptedPassword;
      await User.create(req.body);
    }
    //send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL, //sender gmail adress
        pass: process.env.APP_PASSWORD, // app password from Gmail account
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Authentification",
      html: `<b> Votre email et votre mot de passe sont prêts </b>
      <br/>
      <p>E-mail: <b> ${email} </b> <br> Mot de passe: <b> 123456 </b> </p>
      Vous pouvez  modifier  votre mot de passe à tout moment dans votre profil.
      <a href='http://localhost:3000/login'> Se connecter </a>`,
    });
    res.json({ message: " Un email a été envoyé à l'utilisateur avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "error server" });
  }
};

//Affiche Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get one User from database by id
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 }).populate({ path: 'team', populate: { path: 'projects', populate: 'tasks' } }).populate('tasks')

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
exports.getTeamByEmployee = async (req, res) => {
  try {
    const employees = await User.findById(req.params.id, { password: 0 }).populate({ path: 'team', populate: 'employees' }).populate('tasks')
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
}

//Update a User
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      // Hacher le nouveau mot de passe (ajouter hash password si password a ete modifié)
      const encryptedPassword = await encryptPassword(req.body.password);
      req.body.password = encryptedPassword;
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "L'utilisateur a été modifié" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//delete a User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user.role === 'chef') {
      const team = await Team.findOne({ chef: req.params.id });
      await Promise.all(
        team.employees.map(async (employee) => {
          await User.findByIdAndUpdate(employee, { $unset: { team: 1 } }, { new: true })
        })
      )
      await Team.findByIdAndDelete(team._id)
      await Promise.all(
        team.projects.map(async (project) => {
          await Project.findByIdAndUpdate(project, { $pull: { teams: team._id } }, { new: true })
        })
      )
    }
    if (user.role === 'employe') {
      await Team.findByIdAndUpdate(user.team, { $pull: { employees: req.params.id } }, { new: true });
    }
    // to add delete absences and affected tasks when deleting an employee or chef

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: " L'utilisateur a été supprimé " });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get absences and tasks  from user
exports.detailsUser = async (req, res) => {
  try {
    const user = await User.findOne(req.user._id)
      .populate("absences")
      .populate("tasks");
    res.json({ absences: user.absences, tasks: user.tasks });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des projets de l'équipe",
      error: error.message,
    });
  }
};
