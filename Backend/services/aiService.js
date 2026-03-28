const Groq = require("groq-sdk")

// Check if API key is available
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GROQ_API_KEY not found in environment variables");
}

const groq = apiKey ? new Groq({ apiKey }) : null;

const getAISuggestion = async (tasks) => {
  try {
    if (!tasks || tasks.length === 0) {
      throw new Error("No tasks provided")
    }

    // If no API key, return a simple suggestion
    if (!groq) {
      return generateFallbackSuggestion(tasks);
    }

    const prompt = `
You are an AI task prioritization assistant.

Tasks:
${JSON.stringify(tasks, null, 2)}

Suggest top 3 important tasks with short reasons.
`

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",   // fast + free
      messages: [
        { role: "user", content: prompt }
      ]
    })

    return response.choices[0].message.content

  } catch (error) {
    console.error(" GROQ ERROR:", error)
    // Fallback to simple suggestion if AI fails
    return generateFallbackSuggestion(tasks);
  }
}

// Fallback suggestion when AI is not available
const generateFallbackSuggestion = (tasks) => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  if (incompleteTasks.length === 0) {
    return " All tasks are completed! Great job!";
  }

  // Sort by priority (High > Medium > Low) and deadline
  const prioritizedTasks = incompleteTasks.sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // If priority is same, sort by deadline (earlier first)
    return new Date(a.deadline) - new Date(b.deadline);
  });

  let suggestion = " Top Priority Tasks:\n\n";
  
  prioritizedTasks.slice(0, 3).forEach((task, index) => {
    const daysUntilDeadline = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntilDeadline <= 1 ? " (URGENT!)" : daysUntilDeadline <= 3 ? " (Soon)" : "";
    
    suggestion += `${index + 1}. **${task.title}**\n`;
    suggestion += `   Priority: ${task.priority}${urgency}\n`;
    suggestion += `   Deadline: ${new Date(task.deadline).toLocaleDateString()}\n\n`;
  });

  suggestion += " *Based on task priority and deadline analysis*";
  
  return suggestion;
}

module.exports = { getAISuggestion }