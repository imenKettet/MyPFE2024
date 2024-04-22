const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        title: String,
        chef: { type: Schema.Types.ObjectId, ref: "User" },
        employee: { type: Schema.Types.ObjectId, ref: "User" },
        absence: { type: Schema.Types.ObjectId, ref: "Absence" },
        viewed: { type: Boolean, default: false }
        // createdAt: { type: Date, default: Date.now(), expires: 3600 }, 7d
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
