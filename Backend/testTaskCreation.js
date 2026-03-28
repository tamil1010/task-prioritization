const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const testTaskCreation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get or create a test user
    let user = await User.findOne({ email: "testuser@example.com" });
    if (!user) {
      user = new User({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123"
      });
      await user.save();
      console.log("Created test user:", user.email);
    }

    console.log("Testing task creation for user:", user.email, "ID:", user._id);

    // Simulate creating a task like the frontend would
    const taskData = {
      title: "Test Task for Owner",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "High",
      owner: user._id, // This should be req.user.id in real scenario
      completed: false
    };

    // Create the task
    const task = new Task(taskData);
    const savedTask = await task.save();

    console.log("Task created successfully:");
    console.log("  Title:", savedTask.title);
    console.log("  Owner ID:", savedTask.owner);
    console.log("  Owner matches creator:", savedTask.owner.toString() === user._id.toString());

    // Verify the task was saved correctly
    const retrievedTask = await Task.findById(savedTask._id);
    console.log("Retrieved task owner:", retrievedTask.owner);
    console.log("Task saved correctly in database:", !!retrievedTask);

    // Clean up
    await Task.deleteMany({ title: "Test Task for Owner" });
    console.log("Test task cleaned up");

    console.log("\n✅ Task creation test completed!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testTaskCreation();
