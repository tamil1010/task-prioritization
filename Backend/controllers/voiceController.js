const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Task = require("../models/Task");

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Process voice recording (speech-to-text + AI processing)
const processVoiceRecording = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    // For now, we'll simulate speech-to-text
    // In a real implementation, you would use services like:
    // - Google Speech-to-Text
    // - Azure Speech Services
    // - OpenAI Whisper API
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transcript (in real implementation, this would come from speech-to-text service)
    const mockTranscripts = [
      "I need to complete the React project by next Friday",
      "Schedule a meeting with the design team to discuss the new features",
      "Review and merge the pending pull requests",
      "Buy groceries for the week including milk, eggs, and bread",
      "Call the client to discuss the project requirements",
      "Finish the quarterly report before the deadline",
      "Update the documentation for the new API endpoints"
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    
    // AI processing to extract task information
    const suggestedTask = generateTaskFromTranscript(randomTranscript);
    
    res.json({
      transcript: randomTranscript,
      suggestedTask: suggestedTask
    });

  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ message: "Failed to process voice recording" });
  }
};

// Create task from voice transcript with AI scheduling
const createTaskFromVoice = async (req, res) => {
  try {
    const { transcript } = req.body;
    
    if (!transcript) {
      return res.status(400).json({ message: "Transcript is required" });
    }

    // Generate task details using AI
    const taskDetails = generateTaskFromTranscript(transcript);
    
    // Create the task
    const newTask = new Task({
      title: taskDetails.title,
      deadline: taskDetails.deadline,
      priority: taskDetails.priority,
      owner: req.user.id,
      completed: false
    });

    const savedTask = await newTask.save();
    
    // Populate owner info for response
    await savedTask.populate('owner', 'name email');

    res.status(201).json({
      message: "Task created successfully from voice recording",
      task: savedTask
    });

  } catch (error) {
    console.error("Voice task creation error:", error);
    res.status(500).json({ message: "Failed to create task from voice" });
  }
};

// AI-powered task generation from transcript
const generateTaskFromTranscript = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract task title (remove common phrases)
  let title = transcript
    .replace(/i need to/gi, "")
    .replace(/i have to/gi, "")
    .replace(/schedule/gi, "")
    .replace(/call/gi, "")
    .replace(/buy/gi, "")
    .replace(/finish/gi, "")
    .replace(/complete/gi, "")
    .replace(/review/gi, "")
    .replace(/update/gi, "")
    .replace(/merge/gi, "")
    .replace(/discuss/gi, "")
    .trim();
  
  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  
  // Determine priority based on keywords
  let priority = "Medium";
  if (lowerTranscript.includes("urgent") || lowerTranscript.includes("asap") || lowerTranscript.includes("immediately")) {
    priority = "High";
  } else if (lowerTranscript.includes("when possible") || lowerTranscript.includes("sometime") || lowerTranscript.includes("later")) {
    priority = "Low";
  }
  
  // AI-powered deadline setting
  const deadline = generateSmartDeadline(lowerTranscript);
  
  return {
    title: title || "Voice Task",
    priority: priority,
    deadline: deadline
  };
};

// Smart deadline generation based on transcript analysis
const generateSmartDeadline = (transcript) => {
  const now = new Date();
  
  // Time-based keywords
  if (transcript.includes("today")) {
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }
  
  if (transcript.includes("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 0, 0, 0); // 5 PM
    return tomorrow;
  }
  
  if (transcript.includes("next week")) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(17, 0, 0, 0);
    return nextWeek;
  }
  
  if (transcript.includes("this week")) {
    const thisWeek = new Date(now);
    thisWeek.setDate(thisWeek.getDate() + (7 - thisWeek.getDay()));
    thisWeek.setHours(17, 0, 0, 0);
    return thisWeek;
  }
  
  // Day-based keywords
  if (transcript.includes("monday")) {
    return getNextDayOfWeek("Monday");
  }
  if (transcript.includes("tuesday")) {
    return getNextDayOfWeek("Tuesday");
  }
  if (transcript.includes("wednesday")) {
    return getNextDayOfWeek("Wednesday");
  }
  if (transcript.includes("thursday")) {
    return getNextDayOfWeek("Thursday");
  }
  if (transcript.includes("friday")) {
    return getNextDayOfWeek("Friday");
  }
  if (transcript.includes("saturday") || transcript.includes("weekend")) {
    return getNextDayOfWeek("Saturday");
  }
  if (transcript.includes("sunday")) {
    return getNextDayOfWeek("Sunday");
  }
  
  // Default: 3 days from now at 5 PM
  const defaultDeadline = new Date(now);
  defaultDeadline.setDate(defaultDeadline.getDate() + 3);
  defaultDeadline.setHours(17, 0, 0, 0);
  return defaultDeadline;
};

// Helper function to get next occurrence of a specific day
const getNextDayOfWeek = (dayName) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDay = days.indexOf(dayName);
  const today = new Date().getDay();
  
  let daysUntilTarget = targetDay - today;
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7; // Go to next week if the day has passed
  }
  
  const nextOccurrence = new Date();
  nextOccurrence.setDate(nextOccurrence.getDate() + daysUntilTarget);
  nextOccurrence.setHours(17, 0, 0, 0); // 5 PM
  
  return nextOccurrence;
};

module.exports = {
  processVoiceRecording,
  createTaskFromVoice,
  upload,
  generateTaskFromTranscript,
  generateSmartDeadline
};
