import axios from "axios"

const API = "http://localhost:5000/api/tasks"

// ✅ ADD TASK
export const addTaskApi = async (task) => {
  const res = await axios.post(`${API}/add`, task)
  return res.data
}

// ✅ GET TASKS
export const getTasksApi = async () => {
  const res = await axios.get(`${API}/all`)
  return res.data
}

// ✅ DELETE TASK
export const deleteTaskApi = async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`)
  return res.data
}