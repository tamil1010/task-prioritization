const express = require("express")
const router = express.Router()

const { getTopTasks } = require("../controllers/aiController")

router.get("/top", getTopTasks)

module.exports = router