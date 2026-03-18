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
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-300 w-full group">
      <div className="w-4 flex justify-center text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
        +
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2 items-center min-w-0">
        <input
          type="text"
          placeholder="Type a name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-gray-600 focus:placeholder:text-gray-400"
        />

        {title && (
          <>
            <input
              type="date"
              className="w-[110px] bg-transparent border-b border-white/20 focus:border-white/60 outline-none text-xs text-gray-400"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="time"
              className="w-[80px] bg-transparent border-b border-white/20 focus:border-white/60 outline-none text-xs text-gray-400"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="px-3 py-1 bg-[#2383e2] hover:bg-[#1a66b2] text-white rounded text-xs font-medium cursor-pointer"
            >
              New
            </button>
            <button
              type="button"
              onClick={handleSmartAdd}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium"
              title="Smart Add (e.g. 'Finish report tomorrow 5pm high')"
            >
              🤖
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default TaskForm