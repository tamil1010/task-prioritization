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
      priority
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
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// 🔥 DELETE TASK (IMPROVED)
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    // check ID exists
    if (!id) {
      return res.status(400).json({
        message: "Task ID is required"
      })
    }

    const deletedTask = await Task.findByIdAndDelete(id)

    // check task exists
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