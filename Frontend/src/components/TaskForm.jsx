import { useState } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"

const TaskForm = () => {

  const { addTask, tasks } = useTasks()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [priority, setPriority] = useState("Medium")

  const handleSubmit = (e) => {
    e.preventDefault()

    // 🔥 1. EMPTY CHECK
    if (!title.trim()) {
      toast.error("Task name cannot be empty", {
        style: {
          background: "#0F172A",
          color: "#F87171",
          border: "1px solid #EF4444"
        }
      })
      return
    }

    // 🔥 2. DATE/TIME CHECK
    if (!date || !time) {
      toast.warning("Select date and time", {
        style: {
          background: "#0F172A",
          color: "#FACC15",
          border: "1px solid #FACC15"
        }
      })
      return
    }

    // 🔥 3. DUPLICATE CHECK
    const isDuplicate = tasks.some(
      (task) =>
        task.title.toLowerCase().trim() === title.toLowerCase().trim()
    )

    if (isDuplicate) {
      toast.error("Task already exists!", {
        style: {
          background: "#0F172A",
          color: "#F87171",
          border: "1px solid #EF4444"
        }
      })

      // ✅ CLEAR ONLY TITLE (SMART UX)
      setTitle("")
      return
    }

    // 🔥 4. FUTURE DATE CHECK
    const selectedDateTime = new Date(`${date}T${time}`)
    const now = new Date()

    if (selectedDateTime <= now) {
      toast.error("Please select a future date and time", {
        style: {
          background: "#0F172A",
          color: "#F87171",
          border: "1px solid #EF4444"
        }
      })
      return
    }

    // ✅ ADD TASK
    addTask({
      title,
      deadline: selectedDateTime,
      priority,
      createdAt: new Date()
    })

    // ✅ SUCCESS MESSAGE
    toast.success("Task added successfully", {
      style: {
        background: "#0F172A",
        color: "#22D3EE",
        border: "1px solid #22D3EE"
      }
    })

    // 🔄 RESET FULL FORM AFTER SUCCESS
    setTitle("")
    setDate("")
    setTime("")
    setPriority("Medium")
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0F172A] p-6 rounded-2xl border border-[#06B6D4]/20 shadow-lg mb-8"
    >

      {/* 🔥 HEADING */}
      <h2 className="text-lg font-semibold text-[#06B6D4] mb-4">
        Add New Task
      </h2>

      {/* 🔹 TITLE */}
      <input
        type="text"
        placeholder="Task title"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 🔹 DATE */}
      <input
        type="date"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] outline-none text-sm"
        value={date}
        min={today}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 🔹 TIME */}
      <input
        type="time"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] outline-none text-sm"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* 🔹 PRIORITY */}
      <select
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] outline-none text-sm"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      {/* 🔹 BUTTON */}
      <button className="px-6 py-2 rounded-lg bg-[#06B6D4] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition">
        Add Task
      </button>

    </form>
  )
}

export default TaskForm