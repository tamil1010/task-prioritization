import { useState } from "react"
import useTasks from "../hooks/useTasks"
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa"

const TaskCard = ({ task }) => {

  const { deleteTask, updateTask } = useTasks()

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    title: task.title,
    deadline: task.deadline?.slice(0, 16),
    priority: task.priority
  })

  const formatDateTime = (date) => {
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    updateTask(task._id, formData)
    setIsEditing(false)
  }

  const handleComplete = () => {
    updateTask(task._id, { completed: true })
  }

  return (
    <div
      className={`p-5 rounded-xl mb-4 flex justify-between items-center border transition duration-300 ${
        task.completed
          ? "bg-green-900/20 border-green-500/30 opacity-70"
          : "bg-[#0F172A] border-[#06B6D4]/20 hover:shadow-[0_0_12px_#22D3EE]"
      }`}
    >

      {/* LEFT SIDE */}
      <div className="w-full pr-4">

        {isEditing ? (
          <>
            {/* TITLE */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm"
            />

            {/* DEADLINE */}
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm"
            />

            {/* PRIORITY */}
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] outline-none text-sm"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              className="text-[#06B6D4] text-sm hover:underline"
            >
              Save
            </button>
          </>
        ) : (
          <>
            {/* TITLE */}
            <h3
              className={`font-semibold text-[#06B6D4] ${
                task.completed ? "line-through opacity-60" : ""
              }`}
            >
              {task.title}
            </h3>

            {/* DEADLINE */}
            <p className="text-sm text-gray-400">
              Deadline: {formatDateTime(task.deadline)}
            </p>

            {/* PRIORITY */}
            <p className="text-sm text-gray-400">
              Priority: {task.priority}
            </p>
          </>
        )}

      </div>

      {/* RIGHT ICONS */}
      <div className="flex gap-4 text-lg">

        <FaCheckCircle
          className="text-green-400 cursor-pointer hover:drop-shadow-[0_0_6px_#22D3EE] transition"
          onClick={handleComplete}
        />

        <FaEdit
          className="text-blue-400 cursor-pointer hover:drop-shadow-[0_0_6px_#22D3EE] transition"
          onClick={() => setIsEditing(true)}
        />

        <FaTrash
          className="text-red-400 cursor-pointer hover:drop-shadow-[0_0_6px_#22D3EE] transition"
          onClick={() => deleteTask(task._id)}
        />

      </div>

    </div>
  )
}

export default TaskCard