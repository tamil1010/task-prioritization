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

    const selectedDateTime = new Date(`${date}T${time}`)
    const now = new Date()

    if (selectedDateTime <= now) {
      toast.error("Please select a future date and time")
      return
    }

    addTask({
      title,
      deadline: selectedDateTime,
      priority,
      createdAt: new Date()
    })

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

      <h2 className="bg-[#0F172A] p-6 rounded-2xl border border-[#06B6D4]/20 shadow-lg mb-8">
        Add New Task
      </h2>

      <input
        type="text"
        placeholder="Task title"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm transition"
        value={date}
        min={today}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="w-full mb-4 p-3 rounded-lg bg-[#020617] border border-[#0EA5E9]/30 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none text-sm transition"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <select
        className="bg-[#0F172A] p-6 rounded-2xl border border-[#06B6D4]/20 shadow-lg mb-8"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button className="px-6 py-2 rounded-lg bg-[#06B6D4] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition">
        Add Task
      </button>

    </form>
  )
}

export default TaskForm