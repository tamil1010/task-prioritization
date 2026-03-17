import { useState } from "react"
import useTasks from "../hooks/useTasks"
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa"

const TaskCard = ({ task }) => {

  const { deleteTask, updateTask } = useTasks()

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    title: task.title,
    deadline: task.deadline?.slice(0, 16), // 🔥 important
    priority: task.priority
  })

  const formatDateTime = (date) => {
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  }

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // 🔥 SAVE EDIT
  const handleSave = () => {
    updateTask(task._id, formData)
    setIsEditing(false)
  }

  // ✅ COMPLETE
  const handleComplete = () => {
    updateTask(task._id, { completed: true })
  }

  return (
    <div className={`p-3 rounded mb-3 flex justify-between items-center ${
      task.completed ? "bg-green-100 opacity-70" : "bg-gray-100"
    }`}>

      {/* LEFT */}
      <div>

        {isEditing ? (
          <>
            {/* TITLE */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-1 mb-1 w-full"
            />

            {/* DEADLINE */}
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="border p-1 mb-1 w-full"
            />

            {/* PRIORITY */}
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border p-1 mb-1 w-full"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <button
              onClick={handleSave}
              className="text-blue-600 text-sm"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h3 className={`font-semibold ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            <p>Deadline: {formatDateTime(task.deadline)}</p>
            <p>Priority: {task.priority}</p>
          </>
        )}

      </div>

      {/* RIGHT ICONS */}
      <div className="flex gap-4 text-lg">

        {/* COMPLETE */}
        <FaCheckCircle
          className="text-green-500 cursor-pointer"
          onClick={handleComplete}
        />

        {/* EDIT */}
        <FaEdit
          className="text-blue-500 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />

        {/* DELETE */}
        <FaTrash
          className="text-red-500 cursor-pointer"
          onClick={() => deleteTask(task._id)}
        />

      </div>

    </div>
  )
}

export default TaskCard