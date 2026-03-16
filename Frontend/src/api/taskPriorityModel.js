export const taskPriorityModel = (tasks) => {

  return tasks
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)

}