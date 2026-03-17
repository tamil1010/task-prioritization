import { useState } from "react"
import useTasks from "../hooks/useTasks"

const CalendarView = () => {

  const { tasks } = useTasks()
  const [selectedDate, setSelectedDate] = useState("")

  // 🔥 STATUS LOGIC WITH EMOJI
  const getStatus = (task) => {
    const now = new Date()
    const d = new Date(task.deadline)

    if (task.completed)
      return {
        text: "Completed",
        color: "text-green-400",
        emoji: "✅"
      }

    if (d < now)
      return {
        text: "Missed",
        color: "text-red-400",
        emoji: "❌"
      }

    return {
      text: "Pending",
      color: "text-yellow-400",
      emoji: "⏳"
    }
  }

  // 🔥 FILTER
  const filteredTasks = tasks.filter((task) => {
    if (!selectedDate) return false

    const taskDate = new Date(task.deadline)
      .toISOString()
      .split("T")[0]

    return taskDate === selectedDate
  })

  return (
    <div className="p-6">

      {/* 🔥 HEADING */}
      <h2 className="text-2xl font-semibold text-[#06B6D4] mb-6">
        📅 Calendar View
      </h2>

      {/* 🔥 DATE INPUT */}
      <input
        type="date"
        className="w-full max-w-xs mb-6 p-3 pr-10 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 text-white focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* 🔥 TASK LIST */}
      {selectedDate && (
        <div>

          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Tasks on {selectedDate}
          </h3>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks for this date</p>
          ) : (
            filteredTasks.map((task) => {
              const status = getStatus(task)

              return (
                <div
                  key={task._id}
                  className={`p-4 rounded-xl mb-3 border transition ${
                    task.completed
                      ? "bg-green-900/20 border-green-500/30"
                      : "bg-[#0F172A] border-[#06B6D4]/20 hover:shadow-[0_0_12px_#22D3EE]"
                  }`}
                >

                  {/* TITLE */}
                  <p className={`font-semibold ${
                    task.completed ? "text-green-400" : "text-[#06B6D4]"
                  }`}>
                    {task.title}
                  </p>

                  {/* 🔥 STATUS WITH EMOJI */}
                  <p className={`text-sm ${status.color}`}>
                    Status: {status.text} {status.emoji}
                  </p>

                  {/* PRIORITY */}
                  <p className="text-sm text-gray-400">
                    Priority: {task.priority}
                  </p>

                </div>
              )
            })
          )}

        </div>
      )}

    </div>
  )
}

export default CalendarView