const express = require("express")
const router = express.Router()

const { suggestTasks } = require("../controllers/aiController")

router.post("/suggest", suggestTasks)

module.exports = router