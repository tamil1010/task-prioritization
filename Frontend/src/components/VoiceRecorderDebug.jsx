import { useState } from "react"

const VoiceRecorderDebug = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showButtons, setShowButtons] = useState(false)

  console.log("VoiceRecorderDebug rendered!")
  console.log("isRecording:", isRecording)
  console.log("transcript:", transcript)
  console.log("showButtons:", showButtons)

  const handleTest = () => {
    setIsRecording(false)
    setTranscript("This is a test transcript")
    setShowButtons(true)
    console.log("Test button clicked - buttons should show now")
  }

  const handleSave = () => {
    console.log("Save button clicked!")
    alert("Save button works!")
  }

  return (
    <div className="p-6 bg-[#0F172A] rounded-xl border border-white/10 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">🧪 Voice Recorder Debug</h2>
      
      <button
        onClick={handleTest}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Test Button Display
      </button>

      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-white">isRecording: {isRecording.toString()}</p>
        <p className="text-white">transcript: {transcript || "empty"}</p>
        <p className="text-white">showButtons: {showButtons.toString()}</p>
      </div>

      {/* Test the button condition */}
      {!isRecording && transcript && (
        <div className="mb-4 p-4 bg-green-800 rounded-lg">
          <p className="text-green-400">✅ Button condition met! Buttons should appear below:</p>
        </div>
      )}

      {/* Original buttons */}
      {!isRecording && transcript && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            💾 Save as Task
          </button>
          <button
            onClick={() => {setTranscript(""); setShowButtons(false);}}
            className="flex-1 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            🗑️ Clear
          </button>
        </div>
      )}

      {/* Additional Add and Save Buttons */}
      {!isRecording && transcript && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            💾 Save
          </button>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorderDebug
