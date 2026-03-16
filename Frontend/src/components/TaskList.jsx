import useTasks from "../hooks/useTasks"
import TaskCard from "./TaskCard"

const TaskList = () => {

  const { tasks } = useTasks()

  return (

    <div>

      <h2 className="text-xl font-bold mb-3">
        All Tasks
      </h2>

      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}

    </div>
  )
}

export default TaskList