import { createContext, useState, useEffect } from "react"
import { addTaskAPI, getTasksAPI } from "../api/taskApi"
import toast from "react-hot-toast"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {

  const [tasks, setTasks] = useState([])

  // load tasks from database
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const res = await getTasksAPI()
    setTasks(res.data)
  }

  const addTask = async (task) => {

    try {

      await addTaskAPI(task)

      toast.success("Task added")

      loadTasks()

    } catch (err) {

      toast.error(err.response?.data?.message || "Error adding task")

    }
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  )
}