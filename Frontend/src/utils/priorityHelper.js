// 🔥 CALCULATE AI-STYLE SCORE
export const calculateScore = (task) => {
  const now = new Date()
  const deadline = new Date(task.deadline)

  // ⏳ Time difference in hours
  const timeDiff = (deadline - now) / (1000 * 60 * 60)

  let urgencyScore = 0

  // 🔥 URGENCY BASED ON DEADLINE
  if (timeDiff <= 0) urgencyScore = 0
  else if (timeDiff <= 24) urgencyScore = 5
  else if (timeDiff <= 48) urgencyScore = 4
  else if (timeDiff <= 72) urgencyScore = 3
  else urgencyScore = 1

  // 🔥 PRIORITY SCORE
  const priorityScore =
    task.priority === "High" ? 5 :
    task.priority === "Medium" ? 3 : 1

  // 🔥 FINAL SCORE
  return urgencyScore + priorityScore
}


// 🔥 GET TOP TASKS (AI PRIORITIZATION)
export const getTopTasks = (tasks) => {

  const now = new Date()

  // ✅ STEP 1: FILTER ACTIVE TASKS
  const activeTasks = tasks.filter(task => {
    return (
      !task.completed &&
      new Date(task.deadline) > now
    )
  })

  // ✅ STEP 2: ADD SCORE
  const scoredTasks = activeTasks.map(task => ({
    ...task,
    score: calculateScore(task)
  }))

  // ✅ STEP 3: SORT BY SCORE (HIGH → LOW)
  scoredTasks.sort((a, b) => b.score - a.score)

  // ✅ STEP 4: RETURN TOP 3
  return scoredTasks.slice(0, 3)
}