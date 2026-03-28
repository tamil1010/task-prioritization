import { useState } from "react"
import useTasks from "../hooks/useTasks"
import TaskCard from "./TaskCard"
import TaskForm from "./TaskForm"

const TaskList = () => {

  const { tasks } = useTasks()
  const [filter, setFilter] = useState("todo") // "todo" or "done"

  const filteredTasks = tasks.filter(task => {
    if (filter === "todo") return !task.completed
    if (filter === "done") return task.completed
    return true
  })

  // Sort by deadline if needed (optional)
  const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  return (
    <div className="max-w-4xl w-full mx-auto">

      <h1 className="text-3xl font-bold mb-8 text-[#E0F2FE] text-center">
        To Do List
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b border-[#1A2238] text-sm font-medium text-[#E0F2FE]/60 justify-center">
        <button 
          onClick={() => setFilter("todo")}
          className={`pb-3 -mb-[1px] flex items-center gap-2 px-4 ${filter === "todo" ? "text-[#E0F2FE] border-b-2 border-[#3B82F6]" : "hover:text-[#E0F2FE]"}`}
        >
          <svg viewBox="0 0 14 14" className="w-[14px] h-[14px] fill-current">
            <path d="M2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7ZM1.5 7C1.5 10.0376 3.96243 12.5 7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7Z" fillRule="evenodd" clipRule="evenodd"/>
            <path d="M4 7H10V8H4V7Z"/>
          </svg>
          To Do
        </button>
        <button 
          onClick={() => setFilter("done")}
          className={`pb-3 -mb-[1px] flex items-center gap-2 px-4 ${filter === "done" ? "text-[#E0F2FE] border-b-2 border-[#3B82F6]" : "hover:text-[#E0F2FE]"}`}
        >
          <svg viewBox="0 0 14 14" className="w-[14px] h-[14px] fill-current">
            <path d="M11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7ZM12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7ZM6.24264 9L9.77817 5.46447L9.07107 4.75736L6.24264 7.58579L4.82843 6.17157L4.12132 6.87868L6.24264 9Z" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          Done
        </button>
      </div>

      <div className="flex flex-col mb-6">
        {sortedTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
        {sortedTasks.length === 0 && (
          <div className="py-8 text-sm text-[#E0F2FE]/40 text-center italic">No tasks.</div>
        )}
      </div>

      <TaskForm />

    </div>
  )
}

export default TaskList