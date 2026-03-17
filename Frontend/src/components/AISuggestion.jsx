import { useEffect, useState } from "react"
import useTasks from "../hooks/useTasks"
import { getAISuggestions } from "../api/aiApi"

const AISuggestion = () => {

  const { tasks } = useTasks()

  const [aiText, setAiText] = useState("Loading AI suggestions...")

  // 🔥 CALL AI
  useEffect(() => {
    const fetchAI = async () => {
      if (tasks.length === 0) {
        setAiText("No tasks available for AI suggestions.")
        return
      }

      const suggestion = await getAISuggestions(tasks)
      setAiText(suggestion)
    }

    fetchAI()
  }, [tasks])

  return (
    <div className="mb-6">

      <h2 className="text-xl font-semibold text-[#06B6D4] mb-3">
        🤖 AI Suggestion
      </h2>

      {/* 🔥 AI OUTPUT */}
      <div className="bg-[#0F172A] border border-[#06B6D4]/20 p-4 rounded-xl mb-4 text-sm text-[#22D3EE] whitespace-pre-line">
        {aiText}
      </div>

    </div>
  )
}

export default AISuggestion
