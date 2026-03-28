const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const createTasksForCurrentUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get current user (limatinav2005@gmail.com)
    const user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      console.log("User not found!");
      return;
    }

    console.log("Creating tasks for user:", user.email);

    // Create sample tasks for current user
    const sampleTasks = [
      {
        title: "Complete React project",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: "High",
        owner: user._id,
        completed: false
      },
      {
        title: "Review pull requests",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "Medium",
        owner: user._id,
        completed: false
      },
      {
        title: "Update documentation",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        priority: "Low",
        owner: user._id,
        completed: false
      },
      {
        title: "Fix authentication bug",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: "High",
        owner: user._id,
        completed: true
      },
      {
        title: "Write API tests",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: "Medium",
        owner: user._id,
        completed: false
      }
    ];

    // Insert tasks
    for (const taskData of sampleTasks) {
      const existingTask = await Task.findOne({ title: taskData.title, owner: user._id });
      if (!existingTask) {
        const task = new Task(taskData);
        await task.save();
        console.log(`Created task: ${task.title}`);
      } else {
        console.log(`Task already exists: ${taskData.title}`);
      }
    }

    console.log("Task creation completed!");
    
    // Show final task count
    const userTasks = await Task.find({ owner: user._id });
    console.log(`Total tasks for ${user.email}: ${userTasks.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createTasksForCurrentUser();
