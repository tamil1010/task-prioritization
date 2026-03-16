export const getTopTasks = (tasks) => {

  const today = new Date()

  // filter only valid future tasks
  const validTasks = tasks.filter(task => {
    const deadline = new Date(task.deadline)
    return deadline >= today
  })

  // sort by nearest deadline
  validTasks.sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline)
  })

  // return top 3
  return validTasks.slice(0, 3)
}