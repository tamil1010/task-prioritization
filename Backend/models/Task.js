const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  deadline: {
    type: Date,
    required: true
  },

  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },

  // 🔥 ADD THIS
  completed: {
    type: Boolean,
    default: false
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  collaborators: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  pendingCollaborators: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  rejectedCollaborators: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Task", taskSchema)