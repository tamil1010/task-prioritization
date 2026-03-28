import { useContext } from "react"
import { TaskContext } from "../context/TaskContext"

const SentInvitations = () => {
  const { sentInvitations } = useContext(TaskContext)

  if (sentInvitations.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        You haven't sent any invitations yet.
        <p className="text-sm mt-2">Click "Start Collaboration" to invite collaborators to your tasks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Sent Invitations</h3>
      {sentInvitations.map((task) => (
        <div key={task._id} className="bg-[#0F172A] p-4 rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-2">{task.title}</h4>
              <div className="mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === "High" ? "bg-red-500/20 text-red-400" :
                  task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-green-500/20 text-green-400"
                }`}>
                  {task.priority} Priority
                </span>
                <span className="ml-2 text-sm text-gray-400">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              
              {/* Pending Invitations */}
              {task.pendingCollaborators && task.pendingCollaborators.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-300">Pending Invitations:</p>
                  {task.pendingCollaborators.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{email}</span>
                      </div>
                      <span className="text-xs text-yellow-500">Pending</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Rejected Invitations */}
              {task.rejectedCollaborators && task.rejectedCollaborators.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Rejected Invitations:</p>
                  {task.rejectedCollaborators.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{email}</span>
                      </div>
                      <span className="text-xs text-red-500">Rejected</span>
                    </div>
                  ))}
                </div>
              )}

              {/* No invitations status */}
              {(!task.pendingCollaborators || task.pendingCollaborators.length === 0) && 
               (!task.rejectedCollaborators || task.rejectedCollaborators.length === 0) && (
                <p className="text-sm text-gray-500 italic">No invitations sent for this task</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SentInvitations
