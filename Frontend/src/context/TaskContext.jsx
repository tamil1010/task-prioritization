import { createContext, useState, useEffect } from "react"
import { addTaskApi, getTasksApi, deleteTaskApi } from "../api/taskApi"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {

  const [tasks, setTasks] = useState([])

  // LOAD TASKS
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const data = await getTasksApi()
    setTasks(data)
  }

  // ADD TASK
  const addTask = async (task) => {
    const newTask = await addTaskApi(task)
    setTasks((prev) => [newTask, ...prev])
  }

  // DELETE TASK
  const deleteTask = async (id) => {
    await deleteTaskApi(id)
    setTasks((prev) =>
      prev.filter((task) => task._id !== id)
    )
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}