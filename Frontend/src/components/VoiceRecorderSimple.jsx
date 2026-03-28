import { useState, useRef } from "react"
import useTasks from "../hooks/useTasks"
import { toast } from "react-toastify"

const VoiceRecorder = () => {
  const { addTask } = useTasks()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioURL, setAudioURL] = useState("")
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Process audio for speech-to-text
  const processAudio = async (audioBlob) => {
    setIsProcessing(true)
    
    try {
      // Create form data for API
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
      setTranscript(data.transcript)
      
      if (data.suggestedTask) {
        setTranscript(data.suggestedTask.text)
        toast.success("🤖 AI processed your voice note!")
      } else {
        toast.success("🎙️ Voice recording processed!")
      }
      
    } catch (error) {
      console.error("Error processing audio:", error)
      toast.error("❌ Failed to process voice recording")
      // Fallback: just show that recording is complete
      setTranscript("Voice recording completed. Click save to add as task.")
    } finally {
      setIsProcessing(false)
    }
  }

  console.log("VoiceRecorder component rendered!")

  // Start recording
  const startRecording = async () => {
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
      toast.info("🔍 Processing voice recording...")
    }
  }

  // Save as task with AI scheduling
  const saveAsTask = async () => {
    if (!transcript.trim()) {
      toast.error("⚠️ Please record something first")
      return
    }

    try {
      // Send transcript to AI for task creation with scheduling
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

      {/* Audio Player */}
      {audioURL && !isProcessing && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📻 Your Recording:</p>
          <audio controls className="w-full" src={audioURL}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Transcript Display - Only show after recording */}
      {transcript && !isProcessing && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📝 Your Voice Text:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      )}

      {/* Preview Section - Only show after recording */}
      {transcript && !isProcessing && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 mb-2">📋 Task Preview:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 font-medium mb-2">
              <strong>Title:</strong> {transcript}
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

      {/* Additional Add and Save Buttons */}
      {!isRecording && transcript && !isProcessing && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={saveAsTask}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add
          </button>
          <button
            onClick={saveAsTask}
            className="flex-1 py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            💾 Save
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400">
          📌 <strong>How to use:</strong><br/>
          1. Click "Start Recording" and speak your task<br/>
          2. Click "Stop Recording" when finished<br/>
          3. Click "Save as Task" to add it to your to-do list
        </p>
      </div>
    </div>
  )
}

export default VoiceRecorder
