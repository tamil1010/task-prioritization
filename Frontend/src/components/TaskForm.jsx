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
    <div className="max-w-4xl w-full mx-auto">
      <div className="task-card rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:translateY-[-4px] relative overflow-hidden">
        
        <div className="flex items-center gap-4 text-sm">
          <div className="w-6 h-6 flex justify-center items-center text-[20px] rounded-full btn-primary">
            ✨
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 flex gap-4 items-center min-w-0">
            <input
              type="text"
              placeholder="🚀 Type your amazing task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl outline-none text-[16px] placeholder:text-gray-400 text-white transition-all duration-300"
              style={{background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0'}}
            />

            {title && (
              <>
                <input
                  type="date"
                  className="w-[140px] px-4 py-4 rounded-xl outline-none text-xs transition-all duration-300"
                  style={{background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0'}}
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="w-[100px] px-4 py-4 rounded-xl outline-none text-xs transition-all duration-300"
                  style={{background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0'}}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="btn-primary px-8 py-4 text-sm font-bold cursor-pointer"
                >
                  🎯 Add Task
                </button>
                {/* <button
                  type="button"
                  onClick={handleSmartAdd}
                  className="btn-secondary px-8 py-4 text-sm font-bold cursor-pointer"
                  title="Smart Add (e.g. 'Finish report tomorrow 5pm high')"
                >
                  🤖 AI Magic
                </button> */}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskForm