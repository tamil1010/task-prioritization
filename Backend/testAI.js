// Test the AI service directly
const testAIService = async () => {
  try {
    console.log("🧪 Testing AI service directly...");
    
    const { getAISuggestion } = require("./services/aiService");
    
    const sampleTasks = [
      {
        title: "Complete React project",
        priority: "High",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completed: false
      },
      {
        title: "Review pull requests",
        priority: "Medium", 
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        completed: false
      }
    ];

    console.log("📝 Testing with tasks:", sampleTasks.length, "tasks");
    
    const suggestion = await getAISuggestion(sampleTasks);
    
    console.log("✅ AI Service Response:");
    console.log(suggestion);
    
  } catch (error) {
    console.error("❌ AI Service Test Failed:");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
};

// Test API key
const testAPIKey = () => {
  console.log("🔑 Checking API Key:");
  console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
  console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length || 0);
};

// Run tests
const runTests = async () => {
  console.log("🚀 Starting AI System Tests...\n");
  
  // Test 0: API Key
  testAPIKey();
  
  // Test 1: AI Service
  await testAIService();
  
  console.log("\n🏁 Tests completed!");
};

runTests();
