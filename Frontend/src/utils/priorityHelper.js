export const getTopTasks = (tasks) => {

  const now = new Date()

  // 🔥 STEP 1: FILTER ACTIVE TASKS
  const activeTasks = tasks.filter(task => {
    return (
      !task.completed &&
      new Date(task.deadline) > now
    )
  })

  // 🔥 STEP 2: SORT BY PRIORITY + DEADLINE
  activeTasks.sort((a, b) => {

    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3
    }

    // priority first
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    // then earliest deadline
    return new Date(a.deadline) - new Date(b.deadline)
  })

  // 🔥 STEP 3: RETURN TOP 3
  return activeTasks.slice(0, 3)
}