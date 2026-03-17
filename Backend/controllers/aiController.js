const { getAISuggestion } = require("../services/aiService")

const suggestTasks = async (req, res) => {
  try {
    const { tasks } = req.body

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks provided" })
    }

    const suggestion = await getAISuggestion(tasks)

    res.json({ suggestion })

  } catch (error) {
    console.error("AI Controller Error:", error)
    res.status(500).json({ message: "AI suggestion failed" })
  }
}

module.exports = { suggestTasks }