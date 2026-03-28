const Task = require("../models/Task")

// ✅ ADD TASK
exports.addTask = async (req, res) => {
  try {
    const { title, deadline, priority } = req.body

    if (!title || !deadline || !priority) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const existingTask = await Task.findOne({ title })

    if (existingTask) {
      return res.status(400).json({
        message: "Task already exists"
      })
    }

    const task = new Task({
      title,
      deadline,
      priority,
      owner: req.user.id
    })

    const savedTask = await task.save()

    res.status(201).json(savedTask)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// ✅ GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.email }
      ]
    }).sort({ createdAt: -1 })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 🔥 DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required"
      })
    }

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" })
    }

    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// 🔥 UPDATE TASK (MOVE OUTSIDE)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.owner.toString() !== req.user.id && !task.collaborators.includes(req.user.email.toLowerCase())) {
      return res.status(403).json({ message: "Not authorized to update this task" })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedTask)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 🔥 ADD COLLABORATOR (SHARE - SENDS INVITATION)
exports.addCollaborator = async (req, res) => {
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

    // Only check if user is authenticated - any authenticated user can share
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.email === email.toLowerCase()) {
      return res.status(400).json({ message: "You cannot share a task with yourself" });
    }

    if (task.collaborators.includes(email.toLowerCase())) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    if (task.pendingCollaborators.includes(email.toLowerCase())) {
      return res.status(400).json({ message: "Invitation already sent to this user" });
    }

    task.pendingCollaborators.push(email.toLowerCase());
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ GET PENDING INVITATIONS
exports.getInvitations = async (req, res) => {
  try {
    const tasks = await Task.find({
      pendingCollaborators: req.user.email
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ ACCEPT INVITATION
exports.acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const email = req.user.email;
    if (!task.pendingCollaborators.includes(email)) {
      return res.status(400).json({ message: "No invitation pending for you" });
    }

    // Remove from pending, add to active collaborators
    task.pendingCollaborators = task.pendingCollaborators.filter(e => e !== email);
    if (!task.collaborators.includes(email)) {
      task.collaborators.push(email);
    }
    
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// REJECT INVITATION
exports.rejectInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const email = req.user.email;
    if (!task.pendingCollaborators.includes(email)) {
      return res.status(400).json({ message: "No invitation pending for you" });
    }

    // Remove from pending and add to rejected
    task.pendingCollaborators = task.pendingCollaborators.filter(e => e !== email);
    
    // Add to rejected list if not already there
    if (!task.rejectedCollaborators.includes(email)) {
      task.rejectedCollaborators.push(email);
    }
    
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET REJECTED INVITATIONS
exports.getRejectedInvitations = async (req, res) => {
  try {
    const tasks = await Task.find({
      rejectedCollaborators: req.user.email
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}