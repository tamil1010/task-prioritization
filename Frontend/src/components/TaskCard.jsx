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
      className={`group px-3 py-2 flex items-center gap-3 transition-colors ${
        task.completed ? "opacity-50" : "hover:bg-white/5"
      }`}
    >
      {/* CHECKBOX */}
      <div 
        onClick={handleComplete}
        className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors ${
          task.completed 
            ? "bg-[#2383e2] border-[#2383e2]" 
            : "border-white/30 hover:border-white/60 hover:bg-white/10"
        }`}
      >
        {task.completed && (
          <svg viewBox="0 0 14 14" className="w-[10px] h-[10px] fill-white">
            <path d="M5.5 11.5L1.5 7.5L2.9 6.1L5.5 8.7L11.1 3.1L12.5 4.5L5.5 11.5Z" />
          </svg>
        )}
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">

        {isEditing ? (
          <>
            {/* COMPACT EDIT MODE */}
            <div className="flex items-center gap-2 w-full">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                autoFocus
                className="flex-1 px-2 py-1 bg-transparent border-b border-white/20 focus:border-white/60 outline-none text-sm text-gray-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setIsEditing(false)
                }}
              />
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-36 px-2 py-1 bg-transparent border-b border-white/20 focus:border-white/60 outline-none text-xs text-gray-400"
              />
            </div>
          </>
        ) : (
          <div 
            className="flex items-center gap-4 w-full cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {/* TITLE */}
            <span
              className={`flex-1 truncate text-[15px] font-medium ${
                task.completed ? "text-gray-500 line-through" : "text-gray-200"
              }`}
            >
              {task.title}
            </span>

            {/* DEADLINE */}
            <div className="flex items-center gap-2 group/date cursor-pointer text-xs text-gray-500">
              <span className="group-hover/date:underline">
                {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Add Date'}
              </span>
            </div>

            {/* PRIORITY */}
            <p className="text-sm text-gray-400">
              Priority: {task.priority}
            </p>
          </div>
        )}
      </div>

      {/* RIGHT HOVER ACTIONS */}
      <div className="opacity-0 group-hover:opacity-100 flex gap-2 text-gray-500 transition-opacity">
        <FaTrash
          className="w-3.5 h-3.5 cursor-pointer hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation()
            deleteTask(task._id)
          }}
        />
      </div>

    </div>
  )
}

export default TaskCard