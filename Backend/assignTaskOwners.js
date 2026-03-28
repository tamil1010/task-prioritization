const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const assignTaskOwners = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get current user (limatinav2005@gmail.com)
    let user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      // Create the current user if not exists
      user = new User({
        name: "kani",
        email: "limatinav2005@gmail.com",
        password: "password123"
      });
      await user.save();
      console.log("Created user:", user.email);
    } else {
      console.log("Found existing user:", user.email);
    }

    // Find all tasks without owners
    const tasksWithoutOwner = await Task.find({ owner: { $exists: false } });
    console.log(`Found ${tasksWithoutOwner.length} tasks without owners`);

    // Assign the current user as owner for all tasks without owners
    for (const task of tasksWithoutOwner) {
      task.owner = user._id;
      await task.save();
      console.log(`Assigned owner to task: ${task.title}`);
    }

    // Also check for tasks with null/undefined owner
    const tasksWithNullOwner = await Task.find({ owner: null });
    console.log(`Found ${tasksWithNullOwner.length} tasks with null owner`);

    for (const task of tasksWithNullOwner) {
      task.owner = user._id;
      await task.save();
      console.log(`Assigned owner to null task: ${task.title}`);
    }

    console.log("Task owner assignment completed!");
    
    // Show final task count
    const allTasks = await Task.find({});
    console.log(`Total tasks in database: ${allTasks.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

assignTaskOwners();
