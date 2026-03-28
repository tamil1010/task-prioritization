import axios from "axios"

const API = "http://localhost:5000/api/tasks"

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

// ✅ ADD TASK
export const addTaskApi = async (task) => {
  const res = await axios.post(`${API}/add`, task, getConfig())
  return res.data
}

// ✅ GET TASKS
export const getTasksApi = async () => {
  const res = await axios.get(`${API}/all`, getConfig())
  return res.data
}

// ✅ DELETE TASK
export const deleteTaskApi = async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, getConfig())
  return res.data
}

//Update Task
export const updateTaskApi = async (id, data) => {
  const res = await axios.put(`${API}/update/${id}`, data, getConfig())
  return res.data
}

// SHARE TASK (SEND INVITATION)
export const shareTaskApi = async (id, email) => {
  const res = await axios.post(`${API}/share/${id}`, { email }, getConfig())
  return res.data
}

// GET INVITATIONS
export const getInvitationsApi = async () => {
  const res = await axios.get(`${API}/invitations`, getConfig())
  return res.data
}

//Get Rejected Invitations
export const getRejectedInvitationsApi = async () => {
  const res = await axios.get(`${API}/rejected-invitations`, getConfig())
  return res.data
}

// ACCEPT INVITATION
export const acceptInvitationApi = async (id) => {
  const res = await axios.put(`${API}/accept-invitation/${id}`, {}, getConfig())
  return res.data
}

// ❌ REJECT INVITATION
export const rejectInvitationApi = async (id) => {
  const res = await axios.put(`${API}/reject-invitation/${id}`, {}, getConfig())
  return res.data
}