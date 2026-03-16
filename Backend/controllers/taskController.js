const Task = require("../models/Task")

exports.addTask = async (req, res) => {

  try {

    const { title, deadline, priority } = req.body

    if (!title) {
      return res.status(400).json({
        message: "Task title required"
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

    await task.save()

    res.status(201).json(task)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}

exports.getTasks = async (req, res) => {

  try {

    const tasks = await Task.find().sort({ createdAt: -1 })

    res.json(tasks)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}

exports.deleteTask = async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}