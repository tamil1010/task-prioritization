import { useState, useContext } from "react"
import { TaskContext } from "../context/TaskContext"
import { removeCollaborator } from "../api/collaborationApi"
import { toast } from "react-toastify"

const CollaboratorManager = ({ task }) => {
  const { token, setTasks } = useContext(TaskContext)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleRemoveCollaborator = async (collaboratorEmail) => {
    if (!confirm(`Are you sure you want to remove ${collaboratorEmail} from this task?`)) {
      return
    }

    setLoading(true)
    try {
      await removeCollaborator(task._id, collaboratorEmail, token)
      setTasks(prev => 
        prev.map(t => 
          t._id === task._id 
            ? { ...t, collaborators: t.collaborators.filter(e => e !== collaboratorEmail) }
            : t
        )
      )
      toast.success("Collaborator removed successfully")
    } catch (error) {
      toast.error("Failed to remove collaborator")
    } finally {
      setLoading(false)
    }
  }

  const isOwner = task.owner === localStorage.getItem('userId')

  return (
    <div className="bg-[#0F172A] p-4 rounded-xl border border-white/10 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Collaborators</h3>
      
      {task.collaborators.length === 0 ? (
        <p className="text-gray-400 text-sm">No collaborators yet</p>
      ) : (
        <div className="space-y-2">
          {task.collaborators.map((collaborator) => (
            <div key={collaborator} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2383e2] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {collaborator.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm">{collaborator}</span>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleRemoveCollaborator(collaborator)}
                  disabled={loading}
                  className="px-2 py-1 text-xs font-medium rounded-md border border-red-500/50 text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {task.pendingCollaborators && task.pendingCollaborators.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Pending Invitations</h4>
          <div className="space-y-2">
            {task.pendingCollaborators.map((email) => (
              <div key={email} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{email}</span>
                </div>
                <span className="text-xs text-yellow-500">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollaboratorManager
