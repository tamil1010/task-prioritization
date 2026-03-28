const express = require("express")
const router = express.Router()

const { protect } = require("../middleware/auth")

const { 
  getSentInvitations, 
  getReceivedInvitations, 
  sendInvitation   // 🔥 ADD THIS
} = require("../controllers/invitationController")

// 🔥 INVITATION ENDPOINTS

// SEND INVITATION (MISSING — THIS IS YOUR MAIN BUG)
router.post("/send", protect, sendInvitation)

// GET SENT
router.get("/sent", protect, getSentInvitations)

// GET RECEIVED
router.get("/received", protect, getReceivedInvitations)

module.exports = router