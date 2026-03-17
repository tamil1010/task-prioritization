import { useState } from "react"
import TaskForm from "../components/TaskForm"
import TopTasks from "../components/TopTasks"
import TaskList from "../components/TaskList"

const Dashboard = () => {

  const [view, setView] = useState("top") // default = Top 3

  return (
    <div className="p-4">

      {/* TASK FORM */}
      <TaskForm />

      {/* 🔥 BUTTONS */}
      <div className="flex gap-3 mb-4">

        <button
          onClick={() => setView("top")}
          className={`px-4 py-2 rounded ${
            view === "top"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Top 3 Tasks
        </button>

        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded ${
            view === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          All Tasks
        </button>

      </div>

      {/* 🔥 SWITCH VIEW */}
      {view === "top" ? <TopTasks /> : <TaskList />}

    </div>
  )
}

export default Dashboard