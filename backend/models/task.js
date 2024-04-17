const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    nameTask: String,
    estimatedDuration: Number,
    totalDuration: { type: Number, default: 0 },
    Status: { type: String, default: 'En attente' },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    worked: [{
      startTime: String,
      endTime: String,
      dateWorked: String
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Task", taskSchema);
