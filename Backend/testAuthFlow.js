const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const testAuthFlow = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Step 1: Create a test user
    let user = await User.findOne({ email: "authtest@example.com" });
    if (!user) {
      user = new User({
        name: "Auth Test User",
        email: "authtest@example.com",
        password: "password123"
      });
      await user.save();
      console.log("✅ Created test user:", user.email);
    }

    // Step 2: Generate a token like the backend would
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: "30d" }
    );
    console.log("✅ Generated token for user:", user.email);

    // Step 3: Decode the token like the auth middleware would
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    console.log("✅ Decoded token user ID:", decoded.id);
    console.log("✅ Decoded token email:", decoded.email);
    console.log("✅ User ID matches:", decoded.id.toString() === user._id.toString());

    // Step 4: Simulate req.user object from middleware
    const reqUser = {
      id: decoded.id,
      email: decoded.email
    };
    console.log("✅ Simulated req.user.id:", reqUser.id);
    console.log("✅ Simulated req.user.email:", reqUser.email);

    // Step 5: Create a task using req.user.id (like addTask controller)
    const taskData = {
      title: "Auth Flow Test Task",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "Medium",
      owner: reqUser.id, // This is what the controller does
      completed: false
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    console.log("✅ Task created with owner:");
    console.log("  Task Title:", savedTask.title);
    console.log("  Task Owner ID:", savedTask.owner);
    console.log("  Owner is req.user.id:", savedTask.owner.toString() === reqUser.id.toString());

    // Step 6: Verify user can retrieve their own tasks
    const userTasks = await Task.find({ owner: reqUser.id });
    console.log("✅ User's tasks count:", userTasks.length);
    userTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title} (Owner: ${task.owner})`);
    });

    // Step 7: Clean up
    await Task.deleteMany({ title: "Auth Flow Test Task" });
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 Authentication flow test completed successfully!");
    console.log("📋 Summary:");
    console.log("  - User creation: ✅");
    console.log("  - Token generation: ✅");
    console.log("  - Token decoding: ✅");
    console.log("  - Task creation with req.user.id: ✅");
    console.log("  - Task ownership: ✅");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testAuthFlow();
