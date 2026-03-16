const TaskCard = ({ task }) => {

  return (
    <div className="bg-gray-100 p-3 rounded mb-2">

      <h3 className="font-semibold">
        {task.title}
      </h3>

      <p>Deadline: {task.deadline}</p>

      <p>Priority: {task.priority}</p>

    </div>
  )
}

export default TaskCard