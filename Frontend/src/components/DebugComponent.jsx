import { useState, useContext } from "react"
import { TaskContext } from "../context/TaskContext"
import { useAuth } from "../context/AuthContext"

const DebugComponent = () => {
  const { user } = useAuth()
  const { tasks, invitations, notifications, token } = useContext(TaskContext)
  
  return (
    <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-2">Debug Info:</h3>
      <div className="text-xs text-gray-300 space-y-1">
        <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
        <p>Token: {token ? 'Token exists' : 'No token'}</p>
        <p>Tasks count: {tasks.length}</p>
        <p>Tasks: {JSON.stringify(tasks)}</p>
        <p>Invitations count: {invitations.length}</p>
        <p>Notifications count: {notifications.length}</p>
      </div>
    </div>
  )
}

export default DebugComponent
