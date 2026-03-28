const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const createTasksForUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Find the user by email
    const user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      console.log("User not found. Creating user...");
      const newUser = new User({
        name: "kani",
        email: "limatinav2005@gmail.com",
        password: "password123"
      });
      await newUser.save();
      console.log("Created user for kani");
      return createTasksForUser(); // Recursively call to create tasks
    }

    console.log("Found user:", user.name, user.email);

    // Create sample tasks for this user
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

    // Insert sample tasks
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`Created ${insertedTasks.length} tasks for user ${user.name}:`);
    insertedTasks.forEach(task => {
      console.log(`- ${task.title} (${task.priority}, ${task.completed ? 'Completed' : 'Pending'})`);
    });

    console.log("Tasks created successfully for your user!");
    
    // Check final count
    const userTasks = await Task.find({ owner: user._id });
    console.log(`Total tasks for ${user.name}: ${userTasks.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createTasksForUser();
