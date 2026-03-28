const Task = require("../models/Task");

// ✅ GET SENT INVITATIONS (UPDATED)
exports.getSentInvitations = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user.id,
      "pendingCollaborators.0": { $exists: true }
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET RECEIVED INVITATIONS (UPDATED)
exports.getReceivedInvitations = async (req, res) => {
  try {
    const tasks = await Task.find({
      pendingCollaborators: req.user.email.toLowerCase()
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SEND INVITATION (UPDATED)
exports.sendInvitation = async (req, res) => {
  try {
    const { taskId, email } = req.body;

    if (!taskId || !email) {
      return res.status(400).json({ message: "TaskId and Email required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const normalizedEmail = email.toLowerCase();

    if (!task.pendingCollaborators) {
      task.pendingCollaborators = [];
    }

    // Check if email already exists in pendingCollaborators
    if (task.pendingCollaborators.includes(normalizedEmail)) {
      return res.status(400).json({ message: "Already invited" });
    }

    // Add email as string to pendingCollaborators
    task.pendingCollaborators.push(normalizedEmail);

    await task.save();

    res.status(200).json({
      message: "Invitation sent successfully",
      task
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 REJECT INVITATION (THIS IS THE KEY)
exports.rejectInvitation = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userEmail = req.user.email.toLowerCase();
    
    // Check if user is in pendingCollaborators
    if (!task.pendingCollaborators.includes(userEmail)) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Remove from pendingCollaborators
    task.pendingCollaborators = task.pendingCollaborators.filter(email => email !== userEmail);
    
    // Add to rejectedCollaborators if not already there
    if (!task.rejectedCollaborators.includes(userEmail)) {
      task.rejectedCollaborators.push(userEmail);
    }

    await task.save();

    res.status(200).json({ message: "Invitation rejected" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};