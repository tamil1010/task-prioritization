import { useEffect, useState } from "react"
import useTasks from "../hooks/useTasks"
import { getAISuggestions } from "../api/aiApi"

const AISuggestion = () => {
  const { tasks } = useTasks()

  const [aiText, setAiText] = useState("Loading AI suggestions...")
  const [isLoading, setIsLoading] = useState(true)

  // 🔥 CALL AI
  useEffect(() => {
    const fetchAI = async () => {
      setIsLoading(true)
      
      if (tasks.length === 0) {
        setAiText("No tasks available for AI suggestions.")
        setIsLoading(false)
        return
      }

      try {
        const suggestion = await getAISuggestions(tasks)
        setAiText(suggestion)
      } catch (error) {
        console.error("Error fetching AI suggestions:", error)
        
        // Provide fallback suggestion if API fails
        const incompleteTasks = tasks.filter(task => !task.completed)
        if (incompleteTasks.length === 0) {
          setAiText("🎉 All tasks are completed! Great job!")
        } else {
          const highPriorityTasks = incompleteTasks.filter(task => task.priority === "High")
          const mediumPriorityTasks = incompleteTasks.filter(task => task.priority === "Medium")
          
          let fallbackSuggestion = "💡 **AI Suggestion:**\n\n"
          
          if (highPriorityTasks.length > 0) {
            fallbackSuggestion += `Focus on your **${highPriorityTasks.length} high-priority task(s)** first:\n`
            highPriorityTasks.slice(0, 3).forEach((task, index) => {
              fallbackSuggestion += `${index + 1}. ${task.title}\n`
            })
          } else if (mediumPriorityTasks.length > 0) {
            fallbackSuggestion += `You have **${mediumPriorityTasks.length} medium-priority task(s)** to work on:\n`
            mediumPriorityTasks.slice(0, 3).forEach((task, index) => {
              fallbackSuggestion += `${index + 1}. ${task.title}\n`
            })
          } else {
            fallbackSuggestion += "You have **low-priority tasks** that can be completed when convenient:\n"
            incompleteTasks.slice(0, 3).forEach((task, index) => {
              fallbackSuggestion += `${index + 1}. ${task.title}\n`
            })
          }
          
          fallbackSuggestion += "\n*Based on task priority analysis*"
          setAiText(fallbackSuggestion)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAI()
  }, [tasks])

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] bg-clip-text text-transparent mb-4">
        🤖 AI Suggestion {isLoading && "(Loading...)"}
      </h2>

      {/* 🔥 AI OUTPUT - Premium Glass Morphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/20 to-[#3B82F6]/20 rounded-xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-[#1F2937]/80 to-[#111827]/80 backdrop-blur-xl border border-[#374151]/50 p-6 rounded-xl shadow-2xl">
          <div className="text-sm text-[#E5E7EB] whitespace-pre-line leading-relaxed">
            {aiText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISuggestion
