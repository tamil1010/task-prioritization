import { useContext } from "react"
import { TaskContext } from "../context/TaskContext"

const InvitationsList = () => {
  const { invitations, acceptInvitation, rejectInvitation } = useContext(TaskContext)

  if (invitations.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        You have no pending invitations.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invitations.map((task) => (
        <div key={task._id} className="bg-[#0F172A] p-4 rounded-xl border border-white/10 shadow-lg relative flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
            <p className="text-sm text-gray-400 mb-4">
              Priority: <span className={`font-medium ${
                task.priority === "High" ? "text-red-400" :
                task.priority === "Medium" ? "text-yellow-400" : "text-green-400"
              }`}>{task.priority}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex justify-end gap-3 mt-4 border-t border-white/10 pt-4">
            <button
              onClick={() => acceptInvitation(task._id)}
              className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#2383e2] text-white hover:bg-[#1e70c1] transition"
            >
              Accept
            </button>
            <button
              onClick={() => rejectInvitation(task._id)}
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

export default InvitationsList
