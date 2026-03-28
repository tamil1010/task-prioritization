import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks"

// Get notifications
export const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(`${API_URL}/notifications`, config)
  return response.data
}

// Mark notification as read
export const markNotificationRead = async (notificationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, config)
  return response.data
}

// Remove collaborator
export const removeCollaborator = async (taskId, email, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(`${API_URL}/remove-collaborator/${taskId}`, {
    data: { email }
  }, config)
  return response.data
}
