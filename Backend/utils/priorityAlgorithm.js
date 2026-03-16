const priorityAlgorithm = (tasks) => {

  const today = new Date()

  const scored = tasks.map(task => {

    const deadline = new Date(task.deadline)

    const diffDays =
      (deadline - today) / (1000 * 60 * 60 * 24)

    let score = 0

    if (task.priority === "High") score += 5
    else if (task.priority === "Medium") score += 3
    else score += 1

    if (diffDays <= 1) score += 5
    else if (diffDays <= 3) score += 3
    else if (diffDays <= 7) score += 2

    return { ...task._doc, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 3)
}

module.exports = priorityAlgorithm