import { useContext, useEffect } from "react"
import { TaskContext } from "../context/TaskContext"

const ReceivedInvitations = () => {
  const { receivedInvitations, acceptInvitation, rejectInvitation, loadReceivedInvitations } = useContext(TaskContext)

  // Add useEffect to debug receivedInvitations changes
  useEffect(() => {
    console.log("ReceivedInvitations updated:", receivedInvitations.length, receivedInvitations)
  }, [receivedInvitations])

  if (receivedInvitations.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        You have no pending invitations.
        <p className="text-sm mt-2">When others invite you to collaborate, you'll see those invitations here.</p>
      </div>
    )
  }

  const handleReject = async (taskId) => {
    console.log("Rejecting invitation:", taskId)
    try {
      await rejectInvitation(taskId)
      console.log("Invitation rejected successfully")
      // Force refresh after a short delay to ensure state update
      setTimeout(() => {
        loadReceivedInvitations()
      }, 100)
    } catch (error) {
      console.error("Error rejecting invitation:", error)
    }
  }

  const handleAccept = async (taskId) => {
    console.log("Accepting invitation:", taskId)
    try {
      await acceptInvitation(taskId)
      console.log("Invitation accepted successfully")
      // Force refresh after a short delay to ensure state update
      setTimeout(() => {
        loadReceivedInvitations()
      }, 100)
    } catch (error) {
      console.error("Error accepting invitation:", error)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Received Invitations</h3>
      {receivedInvitations.map((task) => (
        <div key={task._id} className="bg-[#0F172A] p-4 rounded-xl border border-white/10 shadow-lg relative flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">{task.title}</h4>
            <p className="text-sm text-gray-400 mb-4">
              Priority: <span className={`font-medium ${
                task.priority === "High" ? "text-red-400" :
                task.priority === "Medium" ? "text-yellow-400" : "text-green-400"
              }`}>{task.priority}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Shared by: <span className="font-medium text-blue-400">
                {task.owner?.name || task.owner?.email || 'Task Owner'}
              </span>
            </p>
          </div>
          
          <div className="flex justify-end gap-3 mt-4 border-t border-white/10 pt-4">
            <button
              onClick={() => handleAccept(task._id)}
              className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#2383e2] text-white hover:bg-[#1e70c1] transition"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(task._id)}
              className="px-4 py-1.5 text-sm font-medium rounded-md border border-red-500/50 text-red-500 hover:bg-red-500/10 transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReceivedInvitations
