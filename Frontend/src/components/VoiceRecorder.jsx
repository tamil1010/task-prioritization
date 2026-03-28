import { useState, useRef } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"

const VoiceRecorder = () => {
  const { addTask } = useTasks()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioURL, setAudioURL] = useState("")
  const [recordingMode, setRecordingMode] = useState("audio") // "audio" or "realtime"
  const [interimTranscript, setInterimTranscript] = useState("")
  const [voiceContents, setVoiceContents] = useState([]) // Store all voice recordings
  const [currentVoiceContent, setCurrentVoiceContent] = useState("") // Current recording content
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)

  // Start real-time speech recognition
  const startRealTimeRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("❌ Speech recognition not supported in your browser")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
        setCurrentVoiceContent(prev => prev + finalTranscript)
        toast.success("🎯 Captured: " + finalTranscript.trim())
      }
      
      setInterimTranscript(interimTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      toast.error(`❌ Recognition error: ${event.error}`)
      if (event.error === 'no-speech') {
        toast.info("🎤 No speech detected. Please try again.")
      }
    }

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still recording
        recognition.start()
      } else {
        setInterimTranscript('')
        toast.success("✅ Voice recording completed!")
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
    setTranscript("")
    setInterimTranscript("")
    toast.info("🎙️ Real-time voice recognition started...")
  }

  // Start recording
  const startRecording = async () => {
    if (recordingMode === "realtime") {
      startRealTimeRecognition()
      return
    }

    try {
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
        
        // Process the audio for speech-to-text
        await processAudio(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = audioChunks
      mediaRecorder.start()
      setIsRecording(true)
      setTranscript("")
      setAudioURL("")
      
      toast.info("🎙️ Audio recording started...")
    } catch (error) {
      console.error("Error starting recording:", error)
      toast.error("❌ Failed to start recording. Please check microphone permissions.")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (recordingMode === "realtime" && recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    } else if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    setIsRecording(false)
    setInterimTranscript("")
    toast.info("🔍 Processing voice recording...")
  }

  // Process audio for speech-to-text
  const processAudio = async (audioBlob) => {
    setIsProcessing(true)
    
    try {
      // Create form data for the API
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')

      // Send to backend for speech-to-text and AI processing
      const response = await fetch('http://localhost:5000/api/voice/process', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to process audio')
      }

      const data = await response.json()
      
      // Display the transcribed text
      if (data.transcript) {
        setTranscript(data.transcript)
        setCurrentVoiceContent(data.transcript)
        toast.success("🎯 Voice converted to text successfully!")
      }
      
      // If AI processed it into a task, show that too
      if (data.suggestedTask) {
        setTranscript(data.suggestedTask.text)
        setCurrentVoiceContent(data.suggestedTask.text)
        toast.success("🤖 AI processed your voice into a task suggestion!")
      }
      
    } catch (error) {
      console.error("Error processing audio:", error)
      toast.error("❌ Failed to process voice recording")
      
      // Fallback: Try Web Speech API if backend fails
      try {
        await fallbackSpeechRecognition(audioBlob)
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError)
        setTranscript("🎤 Voice recording completed. Unable to convert to text automatically. Click save to add as task.")
        toast.warning("⚠️ Using manual mode - please edit the text below")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Fallback speech recognition using Web Speech API
  const fallbackSpeechRecognition = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        toast.success("🎯 Voice converted to text using browser recognition!")
        resolve(transcript)
      }

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      recognition.start()
    })
  }

  // Save voice content to storage
  const saveVoiceContent = () => {
    if (!currentVoiceContent.trim()) {
      toast.error("⚠️ No voice content to save")
      return
    }

    const newVoiceContent = {
      id: Date.now(),
      text: currentVoiceContent,
      timestamp: new Date().toISOString(),
      audioURL: audioURL
    }

    setVoiceContents(prev => [newVoiceContent, ...prev])
    setCurrentVoiceContent("")
    setTranscript("")
    setAudioURL("")
    
    toast.success("📝 Voice content saved successfully!")
  }

  // Clear current voice content
  const clearCurrentContent = () => {
    setCurrentVoiceContent("")
    setTranscript("")
    setAudioURL("")
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    toast.info("🗑️ Current voice content cleared")
  }

  // Delete saved voice content
  const deleteVoiceContent = (id) => {
    setVoiceContents(prev => prev.filter(content => content.id !== id))
    toast.success("🗑️ Voice content deleted")
  }

  // Load voice content for editing
  const loadVoiceContent = (content) => {
    setCurrentVoiceContent(content.text)
    setTranscript(content.text)
    setAudioURL(content.audioURL || "")
    toast.info("📝 Voice content loaded for editing")
  }
  const saveAsTask = async () => {
    if (!transcript.trim()) {
      toast.error("⚠️ Please record something first")
      return
    }

    try {
      // Send transcript to AI for task creation
      const response = await fetch('http://localhost:5000/api/voice/create-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        },
        body: JSON.stringify({
          transcript: transcript
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const taskData = await response.json()
      
      // Add the task to the context
      await addTask(taskData.task)
      
      // Reset form
      setTranscript("")
      setAudioURL("")
      
      toast.success("✅ Task created successfully from voice note!")
      
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("❌ Failed to create task from voice note")
    }
  }

  // Clear recording
  const clearRecording = () => {
    setTranscript("")
    setAudioURL("")
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    toast.info("🗑️ Recording cleared")
  }

  return (
    <div className="bg-[#0F172A] rounded-xl border border-white/10 shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎙️ Voice Task Creator</h2>
      
      {/* Recording Mode Selection */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-[#1e293b] rounded-lg">
          <button
            onClick={() => setRecordingMode("audio")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              recordingMode === "audio"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎤 Audio Recording
          </button>
          <button
            onClick={() => setRecordingMode("realtime")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              recordingMode === "realtime"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ⚡ Real-time Recognition
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {recordingMode === "audio" 
            ? "📻 Records audio and converts to text after stopping" 
            : "🎯 Converts speech to text in real-time"}
        </p>
      </div>
      
      {/* Recording Controls */}
      <div className="flex gap-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Start {recordingMode === "realtime" ? "Real-time " : ""}Recording
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

      {/* Real-time Transcript Display */}
      {recordingMode === "realtime" && isRecording && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">🎯 Live Transcription:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4 min-h-[100px]">
            <p className="text-gray-300 whitespace-pre-wrap">
              {currentVoiceContent}
              <span className="text-gray-500 italic">{interimTranscript}</span>
            </p>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audioURL && !isProcessing && recordingMode === "audio" && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📻 Your Recording:</p>
          <audio controls className="w-full" src={audioURL}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Voice Content Display */}
      {currentVoiceContent && !isProcessing && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">📝 Voice Content:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentVoiceContent)
                  toast.success("📋 Voice content copied to clipboard!")
                }}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
              >
                📋 Copy
              </button>
              <button
                onClick={() => {
                  setCurrentVoiceContent(currentVoiceContent.charAt(0).toUpperCase() + currentVoiceContent.slice(1).toLowerCase())
                  toast.success("✨ Text formatted!")
                }}
                className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition"
              >
                ✨ Format
              </button>
            </div>
          </div>
          
          {/* Editable Text Area */}
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <textarea
              value={currentVoiceContent}
              onChange={(e) => {
                setCurrentVoiceContent(e.target.value)
                setTranscript(e.target.value)
              }}
              className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none outline-none min-h-[100px]"
              rows={4}
              placeholder="Your voice content will appear here..."
            />
          </div>
          
          {/* Character Count */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {currentVoiceContent.length} characters
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {currentVoiceContent && !isProcessing && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={saveVoiceContent}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            💾 Save Content
          </button>
          <button
            onClick={saveAsTask}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            🚀 Save as Task
          </button>
          <button
            onClick={clearCurrentContent}
            className="flex-1 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            🗑️ Clear
          </button>
        </div>
      )}

      {/* Saved Voice Contents */}
      {voiceContents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">📚 Saved Voice Contents</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {voiceContents.map((content) => (
              <div key={content.id} className="bg-[#1e293b] border border-white/10 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-1 line-clamp-2">
                      {content.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(content.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => loadVoiceContent(content)}
                      className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteVoiceContent(content.id)}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {content.audioURL && (
                  <audio controls className="w-full mt-2" src={content.audioURL}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400">
          📌 <strong>How to use:</strong><br/>
          {recordingMode === "audio" ? (
            <>
              1. Click "Start Recording" and speak your task<br/>
              2. Click "Stop Recording" when finished<br/>
              3. AI will process your voice and convert to text<br/>
              4. Save content for later or create task immediately
            </>
          ) : (
            <>
              1. Click "Start Real-time Recording" and speak<br/>
              2. Watch your words appear in real-time<br/>
              3. Click "Stop Recording" when finished<br/>
              4. Save content for later or create task immediately
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default VoiceRecorder
