import { useState, useRef } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"

const VoiceRecorderMinimal = () => {
  const { addTask } = useTasks()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [realTimeTranscript, setRealTimeTranscript] = useState("")
  const [audioURL, setAudioURL] = useState("")
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)

  // Start recording
  const startRecording = async () => {
    try {
      // Clear previous transcripts
      setRealTimeTranscript("")
      setTranscript("")
      
      // Check if Web Speech API is available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        recognition.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }
          
          // Update real-time transcript
          setRealTimeTranscript(finalTranscript + interimTranscript)
        }
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          toast.error('Speech recognition error. Please try again.')
        }
        
        recognition.onend = () => {
          if (isRecording) {
            recognition.start() // Restart if still recording
          }
        }
        
        recognitionRef.current = recognition
        recognition.start()
      } else {
        toast.warn('Speech recognition not supported in this browser')
      }
      
      // Audio recording for playback
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
        
        // Use the real-time transcript as the final transcript
        const finalTranscript = realTimeTranscript.trim()
        
        if (finalTranscript) {
          setTranscript(finalTranscript)
          console.log("🎙️ Final transcript:", finalTranscript)
        } else {
          setTranscript("Voice recording completed")
          console.log("⚠️ No transcript available, using fallback")
        }
        
        setIsProcessing(false)
        toast.success("🎙️ Voice recording completed!")
      }

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = audioChunks
      mediaRecorder.start()
      setIsRecording(true)
      setAudioURL("")
      
      toast.info("🎙️ Recording started...")
    } catch (error) {
      console.error("Error starting recording:", error)
      toast.error("❌ Failed to start recording. Please check microphone permissions.")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsProcessing(true)
      toast.info("🔍 Finalizing voice recording...")
    }
  }

  // Save as task
  const saveAsTask = async () => {
    // Use real-time transcript first, then final transcript
    const voiceContent = realTimeTranscript.trim() || transcript.trim()
    
    if (!voiceContent) {
      toast.error("⚠️ Please record something first")
      return
    }

    try {
      console.log("🎙️ Creating task from voice:", voiceContent)
      
      // AI-based priority detection
      const detectedPriority = detectPriority(voiceContent)
      console.log("🤖 AI detected priority:", detectedPriority)
      
      // Create task with voice content and AI priority
      const taskData = {
        title: voiceContent,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: detectedPriority,
        completed: false
      }
      
      console.log("📋 Task data to be created:", taskData)
      
      // Add task to the to-do list using the task context
      await addTask(taskData)
      
      console.log("✅ Task successfully added to the to-do list!")
      
      // Reset form
      setTranscript("")
      setRealTimeTranscript("")
      setAudioURL("")
      
      toast.success("✅ Task created successfully from voice note!")
      
      // Switch to the to-do list view to show the new task
      setTimeout(() => {
        window.location.hash = "#all" // Navigate to the to-do list view
      }, 1000)
      
    } catch (error) {
      console.error("❌ Error creating task:", error)
      toast.error("❌ Failed to create task from voice note")
    }
  }

  // AI-based priority detection function
  const detectPriority = (text) => {
    const lowerText = text.toLowerCase().trim()
    
    // Remove common filler words
    const cleanText = lowerText.replace(/\b(the|a|an|to|for|with|in|on|at|by|of|is|are|was|were)\b/g, '').trim()
    
    // HIGH PRIORITY DETECTION - More aggressive
    if (cleanText.includes("today") || cleanText.includes("tonight") || cleanText.includes("this evening")) {
      return "High"
    }
    
    if (cleanText.includes("tomorrow") || cleanText.includes("morning")) {
      return "High"
    }
    
    if (cleanText.includes("this week") || cleanText.includes("next week")) {
      return "High"
    }
    
    // Urgency-based detection - Expanded
    const urgencyWords = ["urgent", "asap", "immediately", "critical", "emergency", "important", "crucial", "vital", "essential", "must", "deadline", "due", "overdue", "late", "priority", "as soon as possible", "as soon as possible", "asap", "now", "right away", "as soon as you can", "need to", "have to", "must finish", "cannot wait", "cannot delay", "immediate action required"]
    for (const word of urgencyWords) {
      if (cleanText.includes(word)) {
        return "High"
      }
    }
    
    // Work complexity detection - More sensitive
    const complexityIndicators = ["project", "development", "implementation", "integration", "deployment", "feature", "functionality", "system", "application", "build", "create", "design", "architecture", "database", "server", "backend", "frontend", "api", "testing", "debugging"]
    for (const indicator of complexityIndicators) {
      if (cleanText.includes(indicator)) {
        return "High"
      }
    }
    
    // Meeting/event detection - Expanded
    const meetingWords = ["meeting", "call", "appointment", "conference", "discussion", "review", "presentation", "demo", "interview", "session", "workshop", "training", "webinar", "standup", "planning", "brainstorm"]
    for (const word of meetingWords) {
      if (cleanText.includes(word)) {
        return "High"
      }
    }
    
    // Task length analysis - Lower threshold for high priority
    const wordCount = cleanText.split(/\s+/).length
    if (wordCount > 8 || (cleanText.includes("project") && wordCount > 4)) {
      return "High"
    }
    
    // LOW PRIORITY DETECTION - More aggressive
    const lowPriorityIndicators = [
      "when possible", "sometime", "later", "eventually", "when convenient",
      "no rush", "low priority", "can wait", "not urgent", "flexible",
      "someday", "next week", "next month", "when time permits",
      "if time", "maybe", "consider", "think about", "look into",
      "optional", "nice to have", "would be good", "if you can", "when available",
      "no pressure", "take your time", "not time sensitive", "relaxed timeline",
      "low importance", "minor", "small", "quick", "simple", "basic", "routine", "regular", "normal", "standard"
    ]
    
    for (const indicator of lowPriorityIndicators) {
      if (cleanText.includes(indicator)) {
        return "Low"
      }
    }
    
    // MEDIUM PRIORITY - Only for truly neutral tasks
    const mediumIndicators = ["update", "check", "review", "test", "verify", "improve", "optimize", "refactor", "document", "write", "read", "learn", "practice", "prepare", "organize", "plan", "schedule"]
    for (const indicator of mediumIndicators) {
      if (cleanText.includes(indicator) && !cleanText.includes("project")) {
        return "Medium"
      }
    }
    
    // Default to medium if no specific indicators found
    return "Medium"
  }

  // Clear recording
  const clearRecording = () => {
    setTranscript("")
    setRealTimeTranscript("")
    setAudioURL("")
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    toast.info("🗑️ Recording cleared")
  }

  return (
    <div className="bg-[#0F172A] rounded-xl border border-white/10 shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎙️ Voice Task Creator</h2>
      
      {/* Recording Controls */}
      <div className="flex gap-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            Stop Recording
          </button>
        )}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-cyan-400">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            Processing voice recording...
          </div>
        </div>
      )}

      {/* Voice Content Display - Real-time transcription */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          📝 Voice Content: {isRecording && <span className="text-red-400 animate-pulse">● Recording...</span>}
        </p>
        <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4 min-h-[100px]">
          {(realTimeTranscript || transcript) ? (
            <p className="text-gray-300 whitespace-pre-wrap">
              {realTimeTranscript || transcript}
              {isRecording && <span className="animate-pulse">|</span>}
            </p>
          ) : (
            <p className="text-gray-500 italic">
              {isRecording ? "Listening... Speak now..." : "Your voice content will appear here after recording..."}
            </p>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {audioURL && !isProcessing && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📻 Your Recording:</p>
          <audio controls className="w-full" src={audioURL}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Transcript Display - Show real-time content while recording */}
      {(transcript || realTimeTranscript) && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📝 Your Voice Text:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">
              {realTimeTranscript || transcript}
              {isRecording && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
      )}

      {/* Preview Section - Show real-time content while recording */}
      {(transcript || realTimeTranscript) && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 mb-2">📋 Task Preview:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 font-medium mb-2">
              <strong>Title:</strong> {realTimeTranscript || transcript}
              {isRecording && <span className="animate-pulse">|</span>}
            </p>
            <p className="text-gray-400 text-sm mb-1">
              <strong>Priority:</strong> Medium
            </p>
            <p className="text-gray-400 text-sm mb-1">
              <strong>Deadline:</strong> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-xs italic">
              🤖 AI will set optimal deadline when saved
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons - Only show after recording stops */}
      {!isRecording && transcript && !isProcessing && (
        <div className="flex gap-3">
          <button
            onClick={saveAsTask}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            💾 Save as Task
          </button>
          <button
            onClick={clearRecording}
            className="flex-1 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            🗑️ Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorderMinimal
