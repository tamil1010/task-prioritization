import useTasks from "../hooks/useTasks"
import TaskCard from "./TaskCard"

const TaskList = () => {

  const { tasks } = useTasks()

  // 🔥 SORT TASKS (IMPORTANT LINE)
  const sortedTasks = [...tasks].sort((a, b) => {
    return a.completed - b.completed
  })

  return (
    <div>

      <h2 className="text-xl font-bold mb-3">
        All Tasks
      </h2>

      {/* 🔥 USE sortedTasks HERE */}
      {sortedTasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}

    </div>
  )
}

export default TaskList