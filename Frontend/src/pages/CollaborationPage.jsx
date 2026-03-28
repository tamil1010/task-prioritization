import { useState, useContext } from "react"
import { TaskContext } from "../context/TaskContext"
import { shareTaskApi } from "../api/taskApi"
import { toast } from "react-toastify"

const CollaborationPage = () => {
  const { tasks, token, loadSentInvitations } = useContext(TaskContext)
  const [selectedTask, setSelectedTask] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [invitationsSent, setInvitationsSent] = useState([])

  const handleSendInvitation = async (e) => {
    e.preventDefault()

    if (!selectedTask) {
      toast.error("Please select a task to share")
      return
    }

    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setLoading(true)
    try {
      await shareTaskApi(selectedTask, email)

      setEmail("")
      setSelectedTask("")
      toast.success(`Invitation sent to ${email}`)

      // 🔥 IMPORTANT: refresh from backend
      await loadSentInvitations()

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 h-full font-sans max-w-4xl mx-auto">
      <div className="bg-[#0F172A] rounded-xl border border-white/10 shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">Start Collaboration</h2>
        
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Task to Share
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent"
            >
              <option value="">Choose a task...</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title} (Priority: {task.priority})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Collaborator Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address of the person you want to invite"
              className="w-full px-4 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#2383e2] text-white font-medium rounded-lg hover:bg-[#1e70c1] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>

      {invitationsSent.length > 0 && (
        <div className="bg-[#0F172A] rounded-xl border border-white/10 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Invitations Sent</h3>
          <div className="space-y-3">
            {invitationsSent.map((invitation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-gray-300">
                    <span className="font-medium">{invitation.email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Task: {tasks.find(t => t._id === invitation.taskId)?.title || 'Unknown'}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(invitation.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollaborationPage
