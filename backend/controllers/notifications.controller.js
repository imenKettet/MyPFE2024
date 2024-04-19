const Notification = require("../models/notifications");

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate("employee").populate("chef").populate('absence');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message || "error server" });
    }
};

exports.readAllNotifications = async (req, res) => {
    try {
        await Notification.updateMany({}, { viewed: true });
        res.json({ message: 'Tout les notifications sont lus' });
    } catch (error) {
        res.status(500).json({ message: error.message || "error server" });
    }
};

exports.readOneNotification = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { viewed: true });
        res.json({ message: 'Tout les notifications sont lus' });
    } catch (error) {
        res.status(500).json({ message: error.message || "error server" });
    }
};