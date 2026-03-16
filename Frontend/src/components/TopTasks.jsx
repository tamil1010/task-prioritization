import useTasks from "../hooks/useTasks"
import { getTopTasks } from "../utils/priorityHelper"
import TaskCard from "./TaskCard"

const TopTasks = () => {

  const { tasks } = useTasks()

  const topTasks = getTopTasks(tasks)

  return (

    <div className="mb-6">

      <h2 className="text-xl font-bold mb-3">
        AI Suggested Top 3 Tasks
      </h2>

      {topTasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}

    </div>
  )
}

export default TopTasks