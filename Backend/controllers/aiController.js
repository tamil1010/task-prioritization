const Task = require("../models/Task")
const priorityAlgorithm = require("../utils/priorityAlgorithm")

exports.getTopTasks = async (req, res) => {

  try {

    const tasks = await Task.find()

    const topTasks = priorityAlgorithm(tasks)

    res.json(topTasks)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}