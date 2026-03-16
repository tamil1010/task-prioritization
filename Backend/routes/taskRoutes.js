const express = require("express")
const router = express.Router()

const {
  addTask,
  getTasks,
  deleteTask
} = require("../controllers/taskController")

router.post("/add", addTask)

router.get("/list", getTasks)

router.delete("/:id", deleteTask)

module.exports = router