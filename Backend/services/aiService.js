const priorityAlgorithm = require("../utils/priorityAlgorithm")

const analyzeTasks = (tasks) => {
  return priorityAlgorithm(tasks)
}

module.exports = analyzeTasks