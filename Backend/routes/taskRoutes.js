const express = require("express")
const router = express.Router()

const { addTask, getTasks, deleteTask } = require("../controllers/taskController")

// ✅ MUST MATCH FRONTEND
router.post("/add", addTask)
router.get("/all", getTasks)     // 🔥 THIS LINE IS IMPORTANT
router.delete("/delete/:id", deleteTask)

module.exports = router