import { useState } from "react"

import useTasks from "../hooks/useTasks"

import { FaTrash, FaEdit, FaCheckCircle, FaShareAlt } from "react-icons/fa"

import { useAuth } from "../context/AuthContext"

import { shareTaskApi } from "../api/taskApi"

import { toast } from "react-toastify"



const TaskCard = ({ task }) => {



  const { deleteTask, updateTask } = useTasks()

  const { user } = useAuth()



  const [isEditing, setIsEditing] = useState(false)

  const [isSharing, setIsSharing] = useState(false)

  const [shareEmail, setShareEmail] = useState("")



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



  const handleSave = async () => {

    try {

      await updateTask(task._id, formData)

      setIsEditing(false)

      toast.success("Task updated successfully!")

    } catch (error) {

      console.error("Failed to update task:", error)

      toast.error("Failed to update task")

    }

  }



  const handleCancel = () => {

    // Reset form data to original task values

    setFormData({

      title: task.title,

      deadline: task.deadline?.slice(0, 16),

      priority: task.priority

    })

    setIsEditing(false)

    toast.info("Edit cancelled")

  }



  const handleComplete = async () => {

    try {

      await updateTask(task._id, { completed: !task.completed })

    } catch (error) {

      console.error("Failed to update task completion:", error)

    }

  }



  const handleShare = async () => {

    if (!shareEmail) return;

    try {

      await shareTaskApi(task._id, shareEmail);

      toast.success(`Shared with ${shareEmail}`);

      setIsSharing(false);

      setShareEmail("");

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to share task");

    }

  }



  const isOwner = user && user._id === task.owner;

  const isCollaborator = user && task.collaborators && task.collaborators.includes(user?.email);

  const canShare = user && user.token;



  // Get priority border color

  const getPriorityBorderColor = (priority) => {

    switch (priority) {

      case "High": return "high"

      case "Medium": return "medium"

      case "Low": return "low"

      default: return "high"

    }

  }



  const getPriorityBadgeColor = (priority) => {

    switch (priority) {

      case "High": return "tag-high"

      case "Medium": return "tag-medium"

      case "Low": return "tag-low"

      default: return "tag-high"

    }

  }



  const getPriorityGlow = (priority) => {

    switch (priority) {

      case "High": return "hover:shadow-red-500/50"

      case "Medium": return "hover:shadow-yellow-500/50"

      case "Low": return "hover:shadow-green-500/50"

      default: return "hover:shadow-purple-500/50"

    }

  }



  return (

    <div

      className={`group px-6 py-4 flex flex-col gap-3 transition-all duration-300 rounded-xl mb-4 hover:transform hover:translateY-[-4px] hover:shadow-2xl ${getPriorityBorderColor(task.priority)} ${

        task.completed ? "opacity-50" : ""

      }`}

      style={{background: 'rgba(18, 24, 38, 0.8)', border: '1px solid rgba(255,255,255,0.05)'}}

    >

      <div className="flex items-center gap-4">

        {/* CHECKBOX - Premium Design */}

        <div 

          onClick={handleComplete}

          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all duration-300 ${

            task.completed 

              ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent shadow-lg" 

              : "border-white/40 hover:border-purple-400 hover:bg-purple-500/20"

          }`}

        >

          {task.completed && (

            <svg viewBox="0 0 14 14" className="w-[14px] h-[14px] fill-white">

              <path d="M5.5 11.5L1.5 7.5L2.9 6.1L5.5 8.7L11.1 3.1L12.5 4.5L5.5 11.5Z" />

            </svg>

          )}

        </div>



        <div className="flex-1 flex items-center justify-between min-w-0">



          {isEditing ? (

            <>

              {/* COMPACT EDIT MODE */}

              <div className="flex flex-col gap-2 w-full">

                <div className="flex items-center gap-2 w-full">

                  <input

                    name="title"

                    value={formData.title}

                    onChange={handleChange}

                    autoFocus

                    className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-sm text-white placeholder:text-white/60"

                    placeholder="Task title"

                  />

                  <input

                    type="datetime-local"

                    name="deadline"

                    value={formData.deadline}

                    onChange={handleChange}

                    className="w-40 px-3 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl focus:border-purple-400 focus:outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-xs text-white"

                  />

                </div>

                

                {/* Save and Cancel Buttons */}

                <div className="flex gap-2 justify-end">

                  <button

                    onClick={handleSave}

                    className="px-6 py-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"

                  >

                    💾 Save

                  </button>

                  <button

                    onClick={handleCancel}

                    className="px-6 py-2 text-xs bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all duration-300"

                  >

                    ❌ Cancel

                  </button>

                </div>

              </div>

            </>

          ) : (

            <div 

              className="flex items-center gap-4 w-full cursor-text"

              onClick={() => setIsEditing(true)}

            >

              {/* TITLE */}

              <span

                className={`flex-1 truncate text-[16px] font-bold ${

                  task.completed ? "line-through" : ""

                }`}

                style={{color: task.completed ? '#94A3B8' : '#E2E8F0'}}

              >

                {task.title}

              </span>



              {/* DEADLINE */}

              <div className="flex items-center gap-2 group/date cursor-pointer text-xs">

                <span className="group-hover/date:underline" style={{color: '#94A3B8'}}>

                  📅 {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Add Date'}

                </span>

              </div>



              {/* PRIORITY BADGE */}

              <span 

                className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityBadgeColor(task.priority)}`}

              >

                {task.priority === "High" ? "🔥" : task.priority === "Medium" ? "⚡" : "✅"} {task.priority}

              </span>

            </div>

          )}

        </div>



        {/* RIGHT HOVER ACTIONS */}

        <div className="opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity" style={{color: '#94A3B8'}}>

          {canShare && (

            <FaShareAlt

              className="w-5 h-5 cursor-pointer hover:text-purple-400 hover:scale-110 transform transition-all duration-300"

              onClick={(e) => {

                e.stopPropagation()

                setIsSharing(!isSharing)

              }}

            />

          )}

          {isOwner && (

            <FaTrash

              className="w-5 h-5 cursor-pointer hover:text-red-400 hover:scale-110 transform transition-all duration-300"

              onClick={(e) => {

                e.stopPropagation()

                deleteTask(task._id)

              }}

            />

          )}

        </div>

      </div>



      {isSharing && (

        <div className="ml-10 flex items-center gap-2 mb-1">

          <input

            type="email"

            value={shareEmail}

            onChange={(e) => setShareEmail(e.target.value)}

            placeholder="👤 Collaborator's email"

            className="px-4 py-2 text-xs bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 w-56"

            onKeyDown={(e) => {

              if (e.key === 'Enter') handleShare()

              if (e.key === 'Escape') setIsSharing(false)

            }}

          />

          <button 

            onClick={handleShare}

            className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"

          >

            🚀 Share

          </button>

        </div>

      )}

    </div>

  )

}



export default TaskCard