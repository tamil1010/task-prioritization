import useTasks from "../hooks/useTasks"
import { getTopTasks } from "../utils/priorityHelper"
import TaskCard from "./TaskCard"

const TopTasks = () => {

  const { tasks } = useTasks()
  const topTasks = getTopTasks(tasks)

  return (
    <div className="mb-6">

      <h2 className="text-xl font-semibold text-[#E5E7EB] mb-3">
        📋 Top 3 Suggestions
      </h2>

      {/* 🔥 TOP TASKS */}
      {topTasks.length > 0 ? (
        topTasks.slice(0, 3).map((task, index) => (
          <TaskCard key={task._id || index} task={task} />
        ))
      ) : (
        <div className="bg-[#121A2B] border border-[#1F2A3A] p-4 rounded-xl text-[#9CA3AF] text-center">
          No tasks available. Add some tasks to see top suggestions.
        </div>
      )}

    </div>
  )
}

export default TopTasks