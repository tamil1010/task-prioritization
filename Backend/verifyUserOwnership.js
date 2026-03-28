const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const verifyUserOwnership = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get current user
    const user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      console.log("User not found!");
      return;
    }

    console.log("Current User:");
    console.log("  ID:", user._id);
    console.log("  Email:", user.email);
    console.log("  Name:", user.name);

    // Get all tasks
    const allTasks = await Task.find({});
    console.log(`\nTotal tasks in database: ${allTasks.length}`);

    // Check tasks owned by current user
    const userTasks = await Task.find({ owner: user._id });
    console.log(`Tasks owned by ${user.email}: ${userTasks.length}`);

    userTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title} (ID: ${task._id})`);
      console.log(`     Priority: ${task.priority}`);
      console.log(`     Deadline: ${task.deadline}`);
      console.log(`     Completed: ${task.completed}`);
    });

    // Check if there are any tasks without owners
    const tasksWithoutOwner = await Task.find({ owner: { $exists: false } });
    if (tasksWithoutOwner.length > 0) {
      console.log(`\n⚠️  Found ${tasksWithoutOwner.length} tasks without owners:`);
      tasksWithoutOwner.forEach(task => {
        console.log(`  - ${task.title}`);
      });
    }

    // Check if there are any tasks with null owner
    const tasksWithNullOwner = await Task.find({ owner: null });
    if (tasksWithNullOwner.length > 0) {
      console.log(`\n⚠️  Found ${tasksWithNullOwner.length} tasks with null owner:`);
      tasksWithNullOwner.forEach(task => {
        console.log(`  - ${task.title}`);
      });
    }

    console.log("\n✅ User ownership verification completed!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

verifyUserOwnership();
