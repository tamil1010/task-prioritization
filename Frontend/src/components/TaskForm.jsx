import { useState } from "react"
import useTasks from "../hooks/useTasks"


const TaskForm = () => {

  const { addTask } = useTasks()

  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("Medium")

  const handleSubmit = (e) => {

    e.preventDefault()

    addTask({
      title,
      deadline,
      priority
    })

    setTitle("")
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow rounded mb-6"
    >

      <input
        className="border p-2 w-full mb-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={deadline}
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