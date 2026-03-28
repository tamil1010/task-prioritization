const express = require("express")
const router = express.Router()

const { protect } = require("../middleware/auth")
const { addTask, getTasks, deleteTask, updateTask, addCollaborator, getInvitations, acceptInvitation, rejectInvitation, getRejectedInvitations } = require("../controllers/taskController")

router.post("/add", protect, addTask)
router.get("/all", protect, getTasks)
router.delete("/delete/:id", protect, deleteTask)

// 🔥 THIS WILL NOW WORK
router.put("/update/:id", protect, updateTask)

// 🔥 SHARE ROUTE (INVITATIONS)
router.post("/share/:id", protect, addCollaborator)
router.get("/invitations", protect, getInvitations)
router.put("/accept-invitation/:id", protect, acceptInvitation)
router.put("/reject-invitation/:id", protect, rejectInvitation)
router.get("/rejected-invitations", protect, getRejectedInvitations)

module.exports = router