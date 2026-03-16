import { useState } from "react"
import useTasks from "../hooks/useTasks"

const TaskForm = () => {

  const { addTask } = useTasks()

  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("Medium")

  const handleSubmit = (e) => {
  e.preventDefault()

  // check empty title
  if (!title.trim()) {
    toast.error("Task name cannot be empty")
    return
  }

  const today = new Date().toISOString().split("T")[0]

  if (deadline < today) {
    toast.error("Deadline must be today or a future date")
    return
  }

  addTask({
    title,
    deadline,
    priority,
    createdAt: new Date()
  })

  setTitle("")
  setDeadline("")
}

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow rounded mb-6"
    >

      <input
  type="text"
  placeholder="Task title"
  className="border p-2 w-full mb-2"
  value={title}
  required
  onChange={(e) => setTitle(e.target.value)}
/>

      <input
  type="date"
  className="border p-2 w-full mb-2"
  value={deadline}
  min={new Date().toISOString().split("T")[0]}
  max="2099-12-31"
  onChange={(e) => setDeadline(e.target.value)}
/>

      <select
        className="border p-2 w-full mb-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Task
      </button>

    </form>
  )
}

export default TaskForm