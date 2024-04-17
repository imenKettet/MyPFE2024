const Absence = require("../models/absence_sheet");
const User = require("../models/user");
//Add Absence_sheet
exports.createAbsence = async (req, res) => {
  try {
    const newAbsence = await Absence.create(req.body);
    await User.findByIdAndUpdate(
      req.body.employe,
      { $push: { absences: newAbsence._id } },
      { new: true }
    );
    res.json({ message: "Fiche d'absence créée avec succès !" });
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
    res.json({ message: "la Fiche d'absence a été modifié" });
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
//delete a Absence_sheet
exports.deletetAbsence = async (req, res) => {
  try {
    await Absence.findByIdAndDelete(req.params.id);
    res.json("la Fiche d'absence  a été supprimé");
  } catch (error) {
    res.status(500).json({ message: error.message || "error server" });
  }
};
