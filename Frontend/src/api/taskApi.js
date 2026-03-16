import axios from "axios"

const API = "http://localhost:5000/api/tasks"

export const addTaskAPI = (task) => {
  return axios.post(`${API}/add`, task)
}

export const getTasksAPI = () => {
  return axios.get(`${API}/list`)
}