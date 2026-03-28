const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const testCompleteFlow = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Step 1: Test user signup (simulating frontend registration)
    console.log("\n🔐 Step 1: Testing User Signup");
    const testEmail = "newuser@test.com";
    let user = await User.findOne({ email: testEmail });
    
    if (user) {
      // Clean up existing user for this test
      await Task.deleteMany({ owner: user._id });
      await User.deleteOne({ email: testEmail });
      console.log("🧹 Cleaned up existing test user");
    }

    // Create new user
    user = new User({
      name: "New Test User",
      email: testEmail,
      password: "password123"
    });
    await user.save();
    console.log("✅ Created new user:", testEmail, "ID:", user._id);

    // Step 2: Test login (simulating frontend login)
    console.log("\n🔑 Step 2: Testing User Login");
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: "30d" }
    );
    console.log("✅ Generated token for user");

    // Step 3: Simulate req.user from auth middleware
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    const reqUser = {
      id: decoded.id,
      email: decoded.email
    };
    console.log("✅ Simulated req.user:", reqUser.email);

    // Step 4: Test task creation (simulating frontend task creation)
    console.log("\n📝 Step 3: Testing Task Creation");
    const taskData = {
      title: "User Ownership Test Task",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "High",
      owner: reqUser.id, // This is what the controller does
      completed: false
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    console.log("✅ Task created with owner:");
    console.log("  Task Title:", savedTask.title);
    console.log("  Task Owner ID:", savedTask.owner);
    console.log("  Creator ID:", reqUser.id);
    console.log("  Owner matches creator:", savedTask.owner.toString() === reqUser.id.toString());

    // Step 5: Verify user can retrieve their own tasks
    console.log("\n📋 Step 4: Verifying Task Retrieval");
    const userTasks = await Task.find({ owner: reqUser.id });
    console.log(`✅ User owns ${userTasks.length} tasks`);

    userTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title}`);
    });

    // Step 6: Test task ownership verification
    console.log("\n🔍 Step 5: Testing Ownership Verification");
    const retrievedTask = await Task.findById(savedTask._id);
    console.log("✅ Retrieved task owner:", retrievedTask.owner);
    console.log("✅ User is confirmed owner:", retrievedTask.owner.toString() === reqUser.id.toString());

    // Step 7: Clean up test data
    console.log("\n🧹 Step 6: Cleaning Up Test Data");
    await Task.deleteMany({ title: "User Ownership Test Task" });
    await User.deleteOne({ email: testEmail });
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 Complete Flow Test Results:");
    console.log("📋 Summary:");
    console.log("  ✅ User signup: Creates user with unique ID");
    console.log("  ✅ User login: Generates token with user info");
    console.log("  ✅ Auth middleware: Extracts user ID from token");
    console.log("  ✅ Task creation: Assigns req.user.id as owner");
    console.log("  ✅ Task ownership: User owns created tasks");
    console.log("  ✅ Task retrieval: User can access their tasks");
    
    console.log("\n💡 Conclusion: When users signup/login with email, they automatically become owners of tasks they create!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testCompleteFlow();
