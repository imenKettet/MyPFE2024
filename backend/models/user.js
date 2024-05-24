const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    phone: String,
    adress: String,
    absences: [{ type: Schema.Types.ObjectId, ref: "Absence" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    team: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
