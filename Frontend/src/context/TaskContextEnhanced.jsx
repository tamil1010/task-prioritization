import { createContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { addTaskApi, getTasksApi, deleteTaskApi, updateTaskApi, getInvitationsApi, acceptInvitationApi, rejectInvitationApi } from "../api/taskApi"
import { getNotifications } from "../api/collaborationApi"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [invitations, setInvitations] = useState([])
  const [notifications, setNotifications] = useState([])

  // LOAD TASKS ON LOGIN
  useEffect(() => {
    if (user) {
      loadTasks()
      loadInvitations()
      loadNotifications()
    } else {
      setTasks([])
      setInvitations([])
      setNotifications([])
    }
  }, [user])

  const loadTasks = async () => {
    try {
      const data = await getTasksApi()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load tasks:", err)
      setTasks([])
    }
  }

  const loadInvitations = async () => {
    try {
      const data = await getInvitationsApi()
      setInvitations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load invitations:", err)
      setInvitations([])
    }
  }

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(token)
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load notifications:", err)
      setNotifications([])
    }
  }

  // ADD TASK
  const addTask = async (task) => {
    try {
      const newTask = await addTaskApi(task)
      setTasks((prev) => [newTask, ...prev])
    } catch (err) {
      console.error(err)
    }
  }

  // DELETE TASK
  const deleteTask = async (id) => {
    await deleteTaskApi(id)
    setTasks((prev) =>
      prev.filter((task) => task._id !== id)
    )
  }

  // UPDATE TASK
const updateTask = async (id, updatedData) => {
  const updated = await updateTaskApi(id, updatedData)

  setTasks((prev) =>
    prev.map((task) =>
      task._id === id ? updated : task
    )
  )
}

  // ACCEPT INVITATION
  const acceptInvitation = async (id) => {
    try {
      await acceptInvitationApi(id)
      setInvitations((prev) => prev.filter((inv) => inv._id !== id))
      loadTasks() // Refresh tasks since a new one is added
    } catch (err) {
      console.error("Error accepting invitation:", err)
    }
  }

  // REJECT INVITATION
  const rejectInvitation = async (id) => {
    try {
      await rejectInvitationApi(id)
      setInvitations((prev) => prev.filter((inv) => inv._id !== id))
    } catch (err) {
      console.error("Error rejecting invitation:", err)
    }
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      invitations,
      notifications,
      token,
      setNotifications,
      addTask,
      deleteTask,
      updateTask,
      acceptInvitation,
      rejectInvitation
    }}>
      {children}
    </TaskContext.Provider>
  )
}
