import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/invitations"

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

// Get sent invitations
export const getSentInvitationsApi = async () => {
  const res = await axios.get(`${API_URL}/sent`, getConfig())
  return res.data
}

// Get received invitations
export const getReceivedInvitationsApi = async () => {
  const res = await axios.get(`${API_URL}/received`, getConfig())
  return res.data
}
