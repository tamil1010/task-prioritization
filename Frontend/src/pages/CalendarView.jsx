import { useState } from "react"
import useTasks from "../hooks/useTasks"

const CalendarView = () => {

  const { tasks } = useTasks()
  const [selectedDate, setSelectedDate] = useState("")

  const getStatus = (deadline) => {
    const now = new Date()
    const d = new Date(deadline)

    if (d < now) return "Missed ❌"
    return "Pending ⏳"
  }

  const filteredTasks = tasks.filter((task) => {
    if (!selectedDate) return false

    const taskDate = new Date(task.deadline).toISOString().split("T")[0]
    return taskDate === selectedDate
  })

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-3">Calendar View</h2>

      {/* DATE PICKER */}
      <input
        type="date"
        className="border p-2 mb-4"
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* TASKS */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold mb-2">
            Tasks on {selectedDate}
          </h3>

          {filteredTasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-100 p-3 rounded mb-2"
              >
                <p className="font-semibold">{task.title}</p>
                <p>Status: {getStatus(task.deadline)}</p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default CalendarView