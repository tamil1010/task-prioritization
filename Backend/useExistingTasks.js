const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const useExistingTasks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Get current user (limatinav2005@gmail.com)
    let user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      // Create the user if not exists
      user = new User({
        name: "kani",
        email: "limatinav2005@gmail.com",
        password: "password123"
      });
      await user.save();
      console.log("✅ Created user:", user.email);
    } else {
      console.log("✅ Found existing user:", user.email);
    }

    // Find all existing tasks in database (regardless of owner)
    const allTasks = await Task.find({});
    console.log(`📋 Found ${allTasks.length} existing tasks in database`);

    if (allTasks.length === 0) {
      console.log("⚠️  No tasks found in database. Creating sample tasks...");
      
      // Create sample tasks if no tasks exist
      const sampleTasks = [
        {
          title: "Complete React project",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: "High",
          owner: user._id,
          completed: false
        },
        {
          title: "Review pull requests",
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          priority: "Medium",
          owner: user._id,
          completed: false
        },
        {
          title: "Update documentation",
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: "Low",
          owner: user._id,
          completed: false
        }
      ];

      for (const taskData of sampleTasks) {
        const task = new Task(taskData);
        await task.save();
        console.log(`✅ Created sample task: ${taskData.title}`);
      }
    } else {
      // Assign existing tasks to current user
      console.log("🔄 Assigning existing tasks to current user...");
      
      for (const task of allTasks) {
        // Update the owner to current user
        task.owner = user._id;
        await task.save();
        console.log(`✅ Assigned task to user: ${task.title}`);
      }
    }

    // Verify the final state
    const userTasks = await Task.find({ owner: user._id });
    console.log(`\n📊 Final count: User now owns ${userTasks.length} tasks`);

    userTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title} (${task.priority})`);
      console.log(`     Deadline: ${new Date(task.deadline).toLocaleDateString()}`);
      console.log(`     Completed: ${task.completed ? 'Yes' : 'No'}`);
    });

    console.log("\n🎉 Task assignment completed!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

useExistingTasks();
