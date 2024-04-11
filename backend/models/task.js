const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    nameTask: String,
    estimatedDuration: Number,
    totalDuration: Number,
    Status: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Task", taskSchema);
