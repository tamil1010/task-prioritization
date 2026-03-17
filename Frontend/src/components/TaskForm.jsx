import { useState } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"

const TaskForm = () => {

  const { addTask } = useTasks()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [priority, setPriority] = useState("Medium")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Task name cannot be empty")
      return
    }

    if (!date || !time) {
      toast.error("Select date and time")
      return
    }

    // 🔥 Combine date + time
    const deadline = new Date(`${date}T${time}`)

    if (deadline < new Date()) {
      toast.error("Deadline must be future")
      return
    }

    addTask({
      title,
      deadline,
      priority,
      createdAt: new Date()
    })

    // reset
    setTitle("")
    setDate("")
    setTime("")
    setPriority("Medium")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow rounded mb-6"
    >

      {/* TITLE */}
      <input
        type="text"
        placeholder="Task title"
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* DATE */}
      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* TIME (clock picker) */}
      <input
        type="time"
        className="border p-2 w-full mb-2"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />

      {/* PRIORITY */}
      <select
        className="border p-2 w-full mb-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      {/* BUTTON */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Task
      </button>

    </form>
  )
}

export default TaskForm