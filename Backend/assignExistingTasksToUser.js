const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const assignExistingTasksToUser = async () => {
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

    // Find all tasks in database
    const allTasks = await Task.find({});
    console.log(`📋 Found ${allTasks.length} tasks in database`);

    if (allTasks.length === 0) {
      console.log("⚠️  No tasks found. Creating diverse sample tasks...");
      
      // Create diverse sample tasks if no tasks exist
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
        },
        {
          title: "Fix authentication bug",
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          priority: "High",
          owner: user._id,
          completed: true
        },
        {
          title: "Write API tests",
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          priority: "Medium",
          owner: user._id,
          completed: false
        },
        {
          title: "Deploy to production",
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          priority: "High",
          owner: user._id,
          completed: false
        },
        {
          title: "Team meeting preparation",
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          priority: "Medium",
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
      // Assign ALL existing tasks to current user, regardless of current owner
      console.log("🔄 Reassigning ALL existing tasks to current user...");
      
      let reassignedCount = 0;
      for (const task of allTasks) {
        // Update the owner to current user
        task.owner = user._id;
        await task.save();
        console.log(`✅ Reassigned task: ${task.title}`);
        reassignedCount++;
      }
      
      console.log(`📊 Reassigned ${reassignedCount} tasks to ${user.email}`);
    }

    // Verify the final state
    const userTasks = await Task.find({ owner: user._id });
    console.log(`\n📊 Final count: User now owns ${userTasks.length} tasks`);

    console.log("\n📋 User's tasks:");
    userTasks.forEach((task, index) => {
      const status = task.completed ? '✅' : '⏳';
      const priority = task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢';
      console.log(`  ${index + 1}. ${status} ${priority} ${task.title}`);
      console.log(`     📅 Deadline: ${new Date(task.deadline).toLocaleDateString()}`);
    });

    console.log("\n🎉 Task assignment completed!");
    console.log("💡 Now when you login as limatinav2005@gmail.com, you will see all these tasks!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

assignExistingTasksToUser();
