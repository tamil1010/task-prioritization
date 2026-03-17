const Groq = require("groq-sdk")

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const getAISuggestion = async (tasks) => {
  try {

    if (!tasks || tasks.length === 0) {
      throw new Error("No tasks provided")
    }

    const prompt = `
You are an AI task prioritization assistant.

Tasks:
${JSON.stringify(tasks, null, 2)}

Suggest top 3 important tasks with short reasons.
`

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",   // 🔥 fast + free
      messages: [
        { role: "user", content: prompt }
      ]
    })

    return response.choices[0].message.content

  } catch (error) {
    console.error("🔥 GROQ ERROR:", error)
    throw new Error(error.message)
  }
}

module.exports = { getAISuggestion }