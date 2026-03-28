// Import the voice controller functions
const voiceController = require("./controllers/voiceController");

// Test the AI task generation
const testAITaskGeneration = () => {
  console.log("🧪 Testing AI Task Generation...\n");

  // Test cases with different time references
  const testCases = [
    "I need to complete the React project by tomorrow",
    "Schedule a meeting with the design team for next Friday",
    "Buy groceries today",
    "Finish the quarterly report this week",
    "Call the client urgently about the project requirements",
    "Review pull requests by Monday",
    "Update documentation sometime next week"
  ];

  testCases.forEach((transcript, index) => {
    console.log(`\n--- Test Case ${index + 1} ---`);
    console.log(`Input: "${transcript}"`);
    
    const taskDetails = voiceController.generateTaskFromTranscript(transcript);
    
    console.log(`Generated Task:`);
    console.log(`  Title: ${taskDetails.title}`);
    console.log(`  Priority: ${taskDetails.priority}`);
    console.log(`  Deadline: ${taskDetails.deadline.toLocaleString()}`);
    console.log(`  Days from now: ${Math.ceil((taskDetails.deadline - new Date()) / (1000 * 60 * 60 * 24))}`);
  });

  console.log("\n✅ AI Task Generation Test Complete!");
};

// Test the smart deadline function specifically
const testSmartDeadline = () => {
  console.log("\n🧪 Testing Smart Deadline Generation...\n");

  const deadlineTests = [
    { input: "today", description: "Today" },
    { input: "tomorrow", description: "Tomorrow" },
    { input: "next week", description: "Next week" },
    { input: "this week", description: "This week" },
    { input: "monday", description: "Monday" },
    { input: "friday", description: "Friday" },
    { input: "weekend", description: "Weekend" },
    { input: "no time keywords", description: "Default (3 days)" }
  ];

  deadlineTests.forEach((test, index) => {
    console.log(`\n--- Deadline Test ${index + 1}: ${test.description} ---`);
    console.log(`Input: "${test.input}"`);
    
    // Mock the deadline generation function
    const deadline = generateSmartDeadline(test.input.toLowerCase());
    
    console.log(`Deadline: ${deadline.toLocaleString()}`);
    console.log(`Days from now: ${Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))}`);
  });
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

// Run tests
testAITaskGeneration();
testSmartDeadline();
