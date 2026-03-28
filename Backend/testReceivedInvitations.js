const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
require("dotenv").config();

const testReceivedInvitations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskprioritization");
    console.log("Connected to MongoDB");

    // Create test users
    let sender = await User.findOne({ email: "sender@test.com" });
    if (!sender) {
      sender = new User({
        name: "Sender User",
        email: "sender@test.com",
        password: "password123"
      });
      await sender.save();
      console.log("✅ Created sender:", sender.email);
    }

    let receiver = await User.findOne({ email: "receiver@test.com" });
    if (!receiver) {
      receiver = new User({
        name: "Receiver User", 
        email: "receiver@test.com",
        password: "password123"
      });
      await receiver.save();
      console.log("✅ Created receiver:", receiver.email);
    }

    // Create a task for sender
    const task = new Task({
      title: "Test Task for Invitation",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "High",
      owner: sender._id,
      completed: false,
      pendingCollaborators: [receiver.email.toLowerCase()] // Add receiver's email
    });

    await task.save();
    console.log("✅ Created task with invitation to:", receiver.email);

    // Test 1: Check if receiver can find this task in received invitations
    console.log("\n🔍 Testing received invitations for:", receiver.email);
    const receivedTasks = await Task.find({
      pendingCollaborators: receiver.email.toLowerCase()
    }).populate('owner', 'name email');

    console.log(`📊 Found ${receivedTasks.length} tasks for receiver:`);
    receivedTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title}`);
      console.log(`     Owner: ${task.owner?.name || task.owner?.email}`);
      console.log(`     Pending: ${task.pendingCollaborators.join(', ')}`);
      console.log('---');
    });

    // Test 2: Check if sender can see this in sent invitations
    console.log("\n🔍 Testing sent invitations for:", sender.email);
    const sentTasks = await Task.find({
      owner: sender._id,
      pendingCollaborators: { $exists: true, $ne: [] }
    }).populate('owner', 'name email');

    console.log(`📊 Found ${sentTasks.length} tasks for sender:`);
    sentTasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title}`);
      console.log(`     Pending: ${task.pendingCollaborators.join(', ')}`);
      console.log('---');
    });

    // Clean up
    await Task.deleteMany({ title: "Test Task for Invitation" });
    console.log("\n🧹 Cleaned up test data");

    console.log("\n✅ Received invitations test completed!");
    console.log("💡 If receiver found the task, the system is working correctly!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testReceivedInvitations();
