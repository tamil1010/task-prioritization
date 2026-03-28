const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const checkInvitations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Find your user
    const user = await User.findOne({ email: "limatinav2005@gmail.com" });
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", user.email);

    // Check for tasks where this user is in pendingCollaborators
    const receivedInvitations = await Task.find({
      pendingCollaborators: user.email
    }).populate('owner', 'name email').sort({ createdAt: -1 });

    console.log(`Found ${receivedInvitations.length} received invitations:`);
    receivedInvitations.forEach((task, index) => {
      console.log(`${index + 1}. Task: ${task.title}`);
      console.log(`   Owner: ${task.owner?.name || task.owner?.email}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Deadline: ${task.deadline}`);
      console.log(`   Pending Collaborators: ${task.pendingCollaborators.join(', ')}`);
      console.log('---');
    });

    // Also check all tasks to see structure
    const allTasks = await Task.find({});
    console.log(`\nTotal tasks in database: ${allTasks.length}`);
    
    allTasks.forEach((task) => {
      if (task.pendingCollaborators && task.pendingCollaborators.length > 0) {
        console.log(`Task "${task.title}" has pending: ${task.pendingCollaborators.join(', ')}`);
      }
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkInvitations();
