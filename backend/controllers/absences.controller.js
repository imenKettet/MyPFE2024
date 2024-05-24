const Absence = require("../models/absence_sheet");
const Notification = require("../models/notifications");
const User = require("../models/user");
//Add Absence_sheet
exports.createAbsence = async (req, res) => {
  try {
    const dateAbsence = req.body.date;
    const found = await Absence.countDocuments({
      date: dateAbsence,
      employe: req.body.employe,
    });
    if (found > 0) {
      return res.status(400).json({ message: "Cette date est déjà remplis!" });
    } else {
      const newAbsence = await Absence.create(req.body);
      await User.findByIdAndUpdate(
        req.body.employe,
        { $push: { absences: newAbsence._id } },
        { new: true }
      );
      const employee = await User.findById(req.body.employe);
      await Notification.create({
        employee: req.body.employe,
        absence: newAbsence._id,
        chef: req.user._id,
        title: `Absence de ${employee.firstName} ${employee.lastName}`,
      });
    }
    res.json({ message: "l'absence est crée avec succès !" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//Affiche Absences
exports.getAllAbsences = async (req, res) => {
  try {
    const absences = await Absence.find().populate("employe");
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};

//get one  Absence_sheet from database by id
exports.getOneAbsence = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id).populate("employe");
    res.json(absence);
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//Update a Absence_sheet
exports.updateAbsence = async (req, res) => {
  try {
    await Absence.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "L'absence a été modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
// //delete a Absence_sheet
// exports.deletetAbsence = async (req, res) => {
//   try {
//     await Absence.findByIdAndDelete(req.params.id);
//     res.json("L'absence a été supprimé");
//   } catch (error) {
//     res.status(500).json({ message: error.message || "error server" });
//   }
// };

// Fonction pour supprimer une absence d'un employé
exports.deletetAbsence = async (req, res) => {
  try {
    // Trouve l'absence à supprimer en fonction de son ID
    const deletedAbsence = await Absence.findById(req.params.id);
    // Trouve et supprime les notifications associées à cette absence
    await Notification.deleteMany({ absence: deletedAbsence._id });
    // Met à jour l'utilisateur associé pour retirer l'absence de sa liste d'absences
    await User.findByIdAndUpdate(deletedAbsence.employe, {
      $pull: { absences: deletedAbsence._id },
    });
    // Supprime l'absence en fonction de son ID
    await Absence.findByIdAndDelete(req.params.id);

    // Répond avec un message JSON indiquant que l'absence a été supprimée avec succès
    res.json("L'absence a été supprimée");
  } catch (error) {
    // En cas d'erreur, répond avec un statut 500 et un message d'erreur
    console.error(error.message);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
