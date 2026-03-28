// Test the task creation system
console.log("🧪 Testing Task Creation System...\n");

// Test 1: Check if addTask function exists
try {
  const { addTask } = require("./src/hooks/useTasks.js");
  console.log("✅ addTask function imported successfully");
} catch (error) {
  console.error("❌ Failed to import addTask:", error.message);
}

// Test 2: Check TaskContext exports
try {
  const TaskContext = require("./src/context/TaskContext.jsx");
  console.log("✅ TaskContext imported successfully");
} catch (error) {
  console.error("❌ Failed to import TaskContext:", error.message);
}

// Test 3: Check API functions
try {
  const { addTaskApi } = require("./src/api/taskApi.js");
  console.log("✅ addTaskApi function imported successfully");
} catch (error) {
  console.error("❌ Failed to import addTaskApi:", error.message);
}

console.log("\n🏁 Task System Test Complete!");
console.log("💡 If all imports work, the issue might be:");
console.log("   1. Backend server not running");
console.log("   2. API endpoint not working");
console.log("   3. Authentication token missing");
console.log("   4. Network connectivity issues");
