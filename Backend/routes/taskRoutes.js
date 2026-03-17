const express = require("express")
const router = express.Router()

// 🔥 FIX: include updateTask here
const { addTask, getTasks, deleteTask, updateTask } = require("../controllers/taskController")

router.post("/add", addTask)
router.get("/all", getTasks)
router.delete("/delete/:id", deleteTask)

// 🔥 THIS WILL NOW WORK
router.put("/update/:id", updateTask)

module.exports = router