import { useState, useContext } from "react"
import { TaskContext } from "../context/TaskContext"
import { markNotificationRead } from "../api/collaborationApi"
import { toast } from "react-toastify"

const NotificationsList = () => {
  const { notifications, setNotifications, token } = useContext(TaskContext)
  const [loading, setLoading] = useState(false)

  const handleMarkAsRead = async (notificationId) => {
    setLoading(true)
    try {
      await markNotificationRead(notificationId, token)
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      )
      toast.success("Notification marked as read")
    } catch (error) {
      toast.error("Failed to mark notification as read")
    } finally {
      setLoading(false)
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        You have no notifications.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {unreadNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Unread Notifications</h3>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <div key={notification._id} className="bg-[#0F172A] p-4 rounded-xl border border-white/10 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.type === "invitation" ? "bg-blue-500/20 text-blue-400" :
                        notification.type === "task_shared" ? "bg-green-500/20 text-green-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {notification.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-1">{notification.message}</p>
                    <p className="text-sm text-gray-500">From: {notification.fromUser}</p>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    disabled={loading}
                    className="ml-4 px-3 py-1 text-sm font-medium rounded-md bg-[#2383e2] text-white hover:bg-[#1e70c1] transition disabled:opacity-50"
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {readNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Read Notifications</h3>
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <div key={notification._id} className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 opacity-75">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    notification.type === "invitation" ? "bg-blue-500/20 text-blue-400" :
                    notification.type === "task_shared" ? "bg-green-500/20 text-green-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {notification.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 mb-1">{notification.message}</p>
                <p className="text-sm text-gray-500">From: {notification.fromUser}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsList
