const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeSheetSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports("TimeSheet", timeSheetSchema);
