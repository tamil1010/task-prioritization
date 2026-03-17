import { useState } from "react"
import useTasks from "../hooks/useTasks"

const CalendarView = () => {

  const { tasks } = useTasks()
  const [selectedDate, setSelectedDate] = useState("")

  // 🔥 STATUS LOGIC (FIXED)
  const getStatus = (task) => {
    const now = new Date()
    const d = new Date(task.deadline)

    // ✅ COMPLETED FIRST (important)
    if (task.completed) return { text: "Completed ✅", color: "text-green-600" }

    // ❌ MISSED
    if (d < now) return { text: "Missed ❌", color: "text-red-600" }

    // ⏳ PENDING
    return { text: "Pending ⏳", color: "text-yellow-600" }
  }

  // 🔥 FILTER BY DATE
  const filteredTasks = tasks.filter((task) => {
    if (!selectedDate) return false

    const taskDate = new Date(task.deadline)
      .toISOString()
      .split("T")[0]

    return taskDate === selectedDate
  })

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">
        📅 Calendar View
      </h2>

      {/* DATE PICKER */}
      <input
        type="date"
        className="border p-2 mb-4"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* TASK LIST */}
      {selectedDate && (
        <div>

          <h3 className="font-semibold mb-3">
            Tasks on {selectedDate}
          </h3>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks</p>
          ) : (
            filteredTasks.map((task) => {
              const status = getStatus(task)

              return (
                <div
                  key={task._id}
                  className={`p-3 rounded mb-2 border ${
                    task.completed ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <p className={`font-semibold ${
                    task.completed ? "line-through" : ""
                  }`}>
                    {task.title}
                  </p>

                  <p className={status.color}>
                    Status: {status.text}
                  </p>

                  <p className="text-sm text-gray-600">
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