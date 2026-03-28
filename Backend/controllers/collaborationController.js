const Task = require("../models/Task")

// ✅ GET NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).populate('notifications.taskId');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ MARK NOTIFICATION AS READ
exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const User = require("../models/User");
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ REMOVE COLLABORATOR (UPDATED — NO OWNER RESTRICTION)
exports.removeCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔥 REMOVED OWNER CHECK → ANY USER CAN REMOVE
    // task.owner = req.user.id; // optional force ownership (not needed now)

    task.collaborators = task.collaborators.filter(
      e => e !== email.toLowerCase()
    );

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}