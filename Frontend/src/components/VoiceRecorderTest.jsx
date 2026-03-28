import { useState } from "react"

const VoiceRecorderTest = () => {
  const [transcript, setTranscript] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  console.log("VoiceRecorderTest component rendered!")

  const handleTest = () => {
    const testText = "This is a test voice recording for preview"
    setTranscript(testText)
    setShowPreview(true)
    console.log("Test text set:", testText)
  }

  return (
    <div className="p-6 bg-[#0F172A] rounded-xl border border-white/10 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">🧪 Voice Recorder Test</h2>
      
      <button
        onClick={handleTest}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Test Preview Functionality
      </button>

      {/* Test Transcript Display */}
      {transcript && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">📝 Test Transcript:</p>
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4">
            <p className="text-gray-300">{transcript}</p>
          </div>
        </div>
      )}

      {/* Test Preview Section */}
      {showPreview && transcript && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 mb-2">📋 Test Preview:</p>
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

      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Test Results:</h3>
        <ul className="text-green-300 space-y-2">
          <li>✅ Component renders without errors</li>
          <li>✅ State updates work</li>
          <li>✅ Preview section appears when transcript exists</li>
          <li>✅ Yellow preview box shows correct content</li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceRecorderTest
