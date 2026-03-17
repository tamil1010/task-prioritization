import axios from "axios"

export const getAISuggestions = async (tasks) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/ai/suggest",
      { tasks }
    )

    return response.data.suggestion
  } catch (error) {
    console.error("AI API Error:", error)
    return "⚠️ Failed to get AI suggestion"
  }
}