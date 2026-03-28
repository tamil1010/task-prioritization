const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { processVoiceRecording, createTaskFromVoice, upload } = require("../controllers/voiceController");

// Process voice recording (speech-to-text + AI processing)
router.post("/process", upload.single('audio'), processVoiceRecording);

// Create task from voice transcript with AI scheduling
router.post("/create-task", protect, createTaskFromVoice);

module.exports = router;
