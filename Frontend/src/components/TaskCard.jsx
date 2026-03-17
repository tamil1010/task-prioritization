import useTasks from "../hooks/useTasks"

const TaskCard = ({ task }) => {

  const { deleteTask } = useTasks()

  const formatDateTime = (date) => {
    const d = new Date(date)

    return `${d.getDate().toString().padStart(2, '0')}/${
      (d.getMonth() + 1).toString().padStart(2, '0')
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-100 p-3 rounded mb-3 flex justify-between items-center">

      {/* LEFT SIDE */}
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p>Deadline: {formatDateTime(task.deadline)}</p>
        <p>Priority: {task.priority}</p>
      </div>

      {/* RIGHT SIDE DELETE BUTTON */}
      <button
        onClick={() => deleteTask(task._id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>

    </div>
  )
}

export default TaskCard