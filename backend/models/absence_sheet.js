const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const absencesSchema = new Schema(
  {
    date: String,
    employe: { type: Schema.Types.ObjectId, ref: "User" },
    absenceType: String,
    duration: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Absence", absencesSchema);
