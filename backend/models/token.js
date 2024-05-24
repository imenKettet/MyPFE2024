const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    token: String,
    idUser: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now, expires: 900 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("token", tokenSchema);
