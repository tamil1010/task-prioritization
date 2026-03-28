import { createContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { addTaskApi, getTasksApi, deleteTaskApi, updateTaskApi, getInvitationsApi, acceptInvitationApi, rejectInvitationApi, getRejectedInvitationsApi } from "../api/taskApi"
import { getNotifications } from "../api/collaborationApi"
import { getSentInvitationsApi, getReceivedInvitationsApi } from "../api/invitationApi"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const { user } = useAuth()
  const token = user?.token
  const [tasks, setTasks] = useState([])
  const [invitations, setInvitations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [sentInvitations, setSentInvitations] = useState([])
  const [receivedInvitations, setReceivedInvitations] = useState([])
  const [rejectedInvitations, setRejectedInvitations] = useState([])

  // LOAD TASKS ON LOGIN
  useEffect(() => {
    if (user) {
      loadTasks()
      loadInvitations()
      loadNotifications()
      loadSentInvitations()
      loadReceivedInvitations()
      loadRejectedInvitations()
    } else {
      setTasks([])
      setInvitations([])
      setNotifications([])
      setSentInvitations([])
      setReceivedInvitations([])
      setRejectedInvitations([])
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

  const loadSentInvitations = async () => {
    try {
      const data = await getSentInvitationsApi()
      setSentInvitations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load sent invitations:", err)
      setSentInvitations([])
    }
  }

  const loadReceivedInvitations = async () => {
    try {
      const data = await getReceivedInvitationsApi()
      setReceivedInvitations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load received invitations:", err)
      setReceivedInvitations([])
    }
  }

  const loadRejectedInvitations = async () => {
    try {
      const data = await getRejectedInvitationsApi()
      setRejectedInvitations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load rejected invitations:", err)
      setRejectedInvitations([])
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
    try {
      const updated = await updateTaskApi(id, updatedData)
      
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? updated : task
        )
      )
      
      // Also refresh sent invitations if this task has pending collaborators
      if (updated.pendingCollaborators && updated.pendingCollaborators.length > 0) {
        loadSentInvitations()
      }
      
      return updated
    } catch (error) {
      console.error("Failed to update task:", error)
      throw error
    }
  }

  // ACCEPT INVITATION
  const acceptInvitation = async (id) => {
    try {
      await acceptInvitationApi(id)
      setInvitations((prev) => prev.filter((inv) => inv._id !== id))
      setReceivedInvitations((prev) => prev.filter((inv) => inv._id !== id))
      loadTasks() // Refresh tasks since a new one is added
      loadReceivedInvitations() // Refresh received invitations
    } catch (err) {
      console.error("Error accepting invitation:", err)
    }
  }

  // REJECT INVITATION
  const rejectInvitation = async (id) => {
    try {
      console.log("TaskContext: Rejecting invitation", id)
      await rejectInvitationApi(id)
      console.log("TaskContext: API call successful")
      
      // Update state
      setInvitations((prev) => {
        const updated = prev.filter((inv) => inv._id !== id)
        console.log("TaskContext: Updated invitations from", prev.length, "to", updated.length)
        return updated
      })
      
      setReceivedInvitations((prev) => {
        const updated = prev.filter((inv) => inv._id !== id)
        console.log("TaskContext: Updated receivedInvitations from", prev.length, "to", updated.length)
        return updated
      })
      
      // Refresh data
      console.log("TaskContext: Refreshing received and rejected invitations")
      loadReceivedInvitations() // Refresh received invitations
      loadRejectedInvitations() // Refresh rejected invitations
    } catch (err) {
      console.error("Error rejecting invitation:", err)
    }
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      invitations,
      notifications,
      sentInvitations,
      receivedInvitations,
      rejectedInvitations,
      token,
      setNotifications,
      addTask,
      deleteTask,
      updateTask,
      acceptInvitation,
      rejectInvitation,
      loadSentInvitations,
      loadReceivedInvitations,
      loadRejectedInvitations
    }}>
      {children}
    </TaskContext.Provider>
  )
}