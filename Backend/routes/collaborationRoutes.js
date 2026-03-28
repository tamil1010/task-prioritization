const express = require("express")
const router = express.Router()

const { protect } = require("../middleware/auth")
const { getNotifications, markNotificationRead, removeCollaborator } = require("../controllers/collaborationController")

// 🔥 COLLABORATION MANAGEMENT
router.get("/notifications", protect, getNotifications)
router.put("/notifications/:notificationId/read", protect, markNotificationRead)
router.delete("/remove-collaborator/:id", protect, removeCollaborator)

module.exports = router
