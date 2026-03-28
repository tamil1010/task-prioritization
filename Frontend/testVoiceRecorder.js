// Test VoiceRecorder component import
console.log("🧪 Testing VoiceRecorder Import...\n");

try {
  const VoiceRecorder = require("./src/components/VoiceRecorder.jsx");
  console.log("✅ VoiceRecorder imported successfully");
  console.log("VoiceRecorder type:", typeof VoiceRecorder);
  
  if (typeof VoiceRecorder === 'function') {
    console.log("✅ VoiceRecorder is a function/component");
  } else {
    console.log("❌ VoiceRecorder is not a function");
  }
  
} catch (error) {
  console.error("❌ Failed to import VoiceRecorder:", error.message);
  console.error("Stack:", error.stack);
}

console.log("\n🧪 Testing useTasks hook...\n");

try {
  const useTasks = require("./src/hooks/useTasks.js");
  console.log("✅ useTasks imported successfully");
  console.log("useTasks type:", typeof useTasks);
  
  if (typeof useTasks === 'function') {
    console.log("✅ useTasks is a function");
  } else {
    console.log("❌ useTasks is not a function");
  }
  
} catch (error) {
  console.error("❌ Failed to import useTasks:", error.message);
}

console.log("\n🏁 Import test completed!");
