// Test if VoiceRecorderSimple component is working
import fs from 'fs';

console.log("🧪 Testing VoiceRecorderSimple Component...\n");

// Test if component file exists and has exports
const componentPath = './src/components/VoiceRecorderSimple.jsx';

try {
  const componentCode = fs.readFileSync(componentPath, 'utf8');
  console.log("✅ VoiceRecorderSimple.jsx file exists and readable");
  
  // Check if preview section is in the code
  if (componentCode.includes('Task Preview:')) {
    console.log("✅ Preview section found in component");
  } else {
    console.log("❌ Preview section NOT found in component");
  }
  
  // Check if preview styling is present
  if (componentCode.includes('bg-yellow-500/10')) {
    console.log("✅ Preview styling found");
  } else {
    console.log("❌ Preview styling NOT found");
  }
  
  // Check if transcript display is present
  if (componentCode.includes('Transcribed Text:')) {
    console.log("✅ Transcript display found");
  } else {
    console.log("❌ Transcript display NOT found");
  }
  
  // Check if save button is present
  if (componentCode.includes('Save as Task')) {
    console.log("✅ Save button found");
  } else {
    console.log("❌ Save button NOT found");
  }
  
  // Check if recording controls are present
  if (componentCode.includes('Start Recording')) {
    console.log("✅ Recording controls found");
  } else {
    console.log("❌ Recording controls NOT found");
  }
  
} catch (error) {
  console.error("❌ Failed to read component file:", error.message);
}

console.log("\n🏁 Component test completed!");
console.log("💡 If preview section exists in code, it should be working on the webpage");
console.log("🔧 If not working, check:");
console.log("   1. Backend server is running (npm start)");
console.log("   2. Frontend is running (npm run dev)");
console.log("   3. Browser console for errors");
console.log("   4. Network tab for failed requests");
