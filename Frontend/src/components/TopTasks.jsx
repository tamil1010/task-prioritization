import { useEffect, useState } from "react"
import useTasks from "../hooks/useTasks"
import { getTopTasks } from "../utils/priorityHelper"
import { getAISuggestions } from "../api/aiApi"
import TaskCard from "./TaskCard"

const TopTasks = () => {

  const { tasks } = useTasks()
  const topTasks = getTopTasks(tasks)

  const [aiText, setAiText] = useState("Loading AI suggestions...")

  // 🔥 CALL AI
  useEffect(() => {
    const fetchAI = async () => {
      if (tasks.length === 0) return

      const suggestion = await getAISuggestions(tasks)
      setAiText(suggestion)
    }

    fetchAI()
  }, [tasks])

  return (
    <div className="mb-6">

      <h2 className="text-xl font-semibold text-[#06B6D4] mb-3">
        🤖 AI Suggested Top Tasks
      </h2>

      {/* 🔥 AI OUTPUT */}
      <div className="bg-[#0F172A] border border-[#06B6D4]/20 p-4 rounded-xl mb-4 text-sm text-[#22D3EE] whitespace-pre-line">
        {aiText}
      </div>

      {/* 🔥 TOP TASKS */}
      {topTasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}

    </div>
  )
}

export default TopTasks