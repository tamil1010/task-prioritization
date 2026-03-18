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
    <div className="max-w-[800px] w-full mx-auto">

      <h1 className="text-4xl font-bold mb-8 text-white">
        To Do List
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-4 border-b border-white/10 text-sm font-medium text-gray-400">
        <button 
          onClick={() => setFilter("todo")}
          className={`pb-2 -mb-[1px] flex items-center gap-2 ${filter === "todo" ? "text-white border-b-2 border-white" : "hover:text-gray-300"}`}
        >
          <svg viewBox="0 0 14 14" className="w-[14px] h-[14px] fill-current">
            <path d="M2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7ZM1.5 7C1.5 10.0376 3.96243 12.5 7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7Z" fillRule="evenodd" clipRule="evenodd"/>
            <path d="M4 7H10V8H4V7Z"/>
          </svg>
          To Do
        </button>
        <button 
          onClick={() => setFilter("done")}
          className={`pb-2 -mb-[1px] flex items-center gap-2 ${filter === "done" ? "text-white border-b-2 border-white" : "hover:text-gray-300"}`}
        >
          <svg viewBox="0 0 14 14" className="w-[14px] h-[14px] fill-current">
            <path d="M11.5 7C11.5 9.48528 9.48528 11.5 7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7ZM12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7ZM6.24264 9L9.77817 5.46447L9.07107 4.75736L6.24264 7.58579L4.82843 6.17157L4.12132 6.87868L6.24264 9Z" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          Done
        </button>
      </div>

      <div className="flex flex-col mb-4">
        {sortedTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
        {sortedTasks.length === 0 && (
          <div className="py-4 text-sm text-gray-500 italic">No tasks.</div>
        )}
      </div>

      <TaskForm />

    </div>
  )
}

export default TaskList