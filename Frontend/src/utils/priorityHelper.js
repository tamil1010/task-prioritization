export const getTopTasks = (tasks) => {

  const today = new Date()

  const scored = tasks.map(task => {

    const deadline = new Date(task.deadline)

    const diff =
      (deadline - today) / (1000 * 60 * 60 * 24)

    let score = 0

    if (task.priority === "High") score += 5
    if (task.priority === "Medium") score += 3

    if (diff <= 1) score += 5
    else if (diff <= 3) score += 3

    return { ...task, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 3)
}