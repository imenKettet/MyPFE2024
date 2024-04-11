const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    nameProject: String,
    client: String,
    dateStart: String,
    dateEnd: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Project", projectSchema);
