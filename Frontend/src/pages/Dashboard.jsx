import { useState } from "react"
import TaskForm from "../components/TaskForm"
import TopTasks from "../components/TopTasks"
import TaskList from "../components/TaskList"
import AISuggestion from "../components/AISuggestion"

const Dashboard = () => {

  const [view, setView] = useState("suggestions")

  return (
    <div className="p-6">

      <TaskForm />

      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setView("suggestions")}
          className={`px-5 py-2 rounded-lg transition ${
            view === "suggestions"
              ? "bg-[#06B6D4] text-black shadow-[0_0_12px_#22D3EE]"
              : "bg-[#0F172A] border border-[#06B6D4]/20 text-gray-300"
          }`}
        >
          Top 3 Suggestions
        </button>

        <button
          onClick={() => setView("ai")}
          className={`px-5 py-2 rounded-lg transition ${
            view === "ai"
              ? "bg-[#06B6D4] text-black shadow-[0_0_12px_#22D3EE]"
              : "bg-[#0F172A] border border-[#06B6D4]/20 text-gray-300"
          }`}
        >
          AI Suggestion
        </button>

        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "all"
              ? "bg-primary text-black shadow-neon"
              : "bg-card border border-primary/20 text-gray-300"
          }`}
        >
          All Tasks
        </button>

      </div>

      {view === "suggestions" ? <TopTasks /> : 
       view === "ai" ? <AISuggestion /> : 
       <TaskList />}

    </div>
  )
}

export default Dashboard