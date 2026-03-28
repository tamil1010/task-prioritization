const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const createSampleTasks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get the user
    const user = await User.findOne();
    if (!user) {
      console.log("No user found. Please create a user first.");
      return;
    }

    // Create sample tasks
    const sampleTasks = [
      {
        title: "Complete project documentation",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: "High",
        owner: user._id,
        completed: false
      },
      {
        title: "Review code changes",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "Medium",
        owner: user._id,
        completed: false
      },
      {
        title: "Update dependencies",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        priority: "Low",
        owner: user._id,
        completed: false
      },
      {
        title: "Fix login bug",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: "High",
        owner: user._id,
        completed: true
      },
      {
        title: "Write unit tests",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: "Medium",
        owner: user._id,
        completed: false
      }
    ];

    // Insert sample tasks
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`Created ${insertedTasks.length} sample tasks:`);
    insertedTasks.forEach(task => {
      console.log(`- ${task.title} (${task.priority}, ${task.completed ? 'Completed' : 'Pending'})`);
    });

    console.log("Sample tasks created successfully!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createSampleTasks();
