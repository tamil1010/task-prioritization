import { useState } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"
import * as chrono from "chrono-node"

const TaskForm = () => {

  const { addTask, tasks } = useTasks()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [priority, setPriority] = useState("Medium")

  // 🔥 NLP PARSER
  const parseInput = (text) => {
  const results = chrono.parse(text)

  const parsedDate = results.length > 0
    ? results[0].start.date()
    : null

  let priority = "Medium"

  if (text.toLowerCase().includes("high")) priority = "High"
  if (text.toLowerCase().includes("low")) priority = "Low"

  return {
    title: text,
    deadline: parsedDate,
    priority
  }
}

  // 🔥 NORMAL ADD
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Task name cannot be empty")
      return
    }

    if (!date || !time) {
      toast.warning("Select date and time")
      return
    }

    const isDuplicate = tasks.some(
      (task) =>
        task.title.toLowerCase().trim() === title.toLowerCase().trim()
    )

    if (isDuplicate) {
      toast.error("Task already exists!")
      setTitle("")
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

    toast.success("Task added successfully")

    setTitle("")
    setDate("")
    setTime("")
    setPriority("Medium")
  }

  // 🔥 SMART ADD (AI INPUT)
  const handleSmartAdd = () => {

    if (!title.trim()) {
      toast.error("Enter task in natural language")
      return
    }

    const parsed = parseInput(title)

    if (!parsed.deadline) {
      toast.error("Could not understand date")
      return
    }

    const isDuplicate = tasks.some(
      (task) =>
        task.title.toLowerCase().trim() === parsed.title.toLowerCase().trim()
    )

    if (isDuplicate) {
      toast.error("Task already exists!")
      setTitle("")
      return
    }

    addTask({
      title: parsed.title,
      deadline: parsed.deadline,
      priority: parsed.priority,
      createdAt: new Date()
    })

    toast.success("Smart task added 🤖")

    setTitle("")
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0F172A] p-6 rounded-2xl border border-[#06B6D4]/20 shadow-lg mb-8"
    >

      <h2 className="text-lg font-semibold text-[#06B6D4] mb-4">
        Add New Task
      </h2>

      {/* 🔹 TITLE */}
      <input
        type="text"
        placeholder="e.g. Finish report tomorrow 5pm high"
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

      {/* 🔹 BUTTONS */}
      <div className="flex gap-3">

        <button className="px-6 py-2 rounded-lg bg-[#06B6D4] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition">
          Add Task
        </button>

        <button
          type="button"
          onClick={handleSmartAdd}
          className="px-6 py-2 rounded-lg bg-[#0EA5E9] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition"
        >
          🤖 Smart Add
        </button>

      </div>

    </form>
  )
}

export default TaskForm