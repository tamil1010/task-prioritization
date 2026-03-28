const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Check all collections
    const taskCount = await Task.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`Tasks in database: ${taskCount}`);
    console.log(`Users in database: ${userCount}`);

    // Show all tasks
    const allTasks = await Task.find({});
    console.log("All tasks:", JSON.stringify(allTasks, null, 2));

    // Show all users
    const allUsers = await User.find({});
    console.log("All users:", JSON.stringify(allUsers, null, 2));
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkDatabase();
