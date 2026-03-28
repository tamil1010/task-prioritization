const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const taskRoutes = require("./routes/taskRoutes")
const aiRoutes = require("./routes/aiRoutes")
const authRoutes = require("./routes/authRoutes")
const collaborationRoutes = require("./routes/collaborationRoutes")
const invitationRoutes = require("./routes/invitationRoutes")
const voiceRoutes = require("./routes/voiceRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/tasks", taskRoutes)
app.use("/api/tasks", collaborationRoutes)
app.use("/api/invitations", invitationRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/voice", voiceRoutes)
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})