import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TaskForm from "../components/TaskForm"
import TopTasks from "../components/TopTasks"
import TaskList from "../components/TaskList"
import AISuggestion from "../components/AISuggestion"
import InvitationsPage from "../components/InvitationsPage"
import VoiceRecorder from "../components/VoiceRecorderMinimal"
import VoiceRecorderTest from "../components/VoiceRecorderTest"

const Dashboard = () => {

  const [view, setView] = useState("suggestions")
  const navigate = useNavigate()

  return (
    <div className="p-6 h-full font-[Poppins] max-w-6xl mx-auto flex flex-col items-center">

      <div className="flex gap-4 mb-10 w-full justify-center flex-wrap">
        <button
          onClick={() => setView("all")}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[16px] transform hover:scale-110 ${
            view === "all"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl animate-pulse"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg border border-white/30"
          }`}
        >
          To Do List
        </button>

        <button
          onClick={() => setView("suggestions")}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[16px] transform hover:scale-110 ${
            view === "suggestions"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl animate-pulse"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg border border-white/30"
          }`}
        >
          Top Priority
        </button>

        <button
          onClick={() => setView("ai")}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[16px] transform hover:scale-110 ${
            view === "ai"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl animate-pulse"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg border border-white/30"
          }`}
        >
          AI Magic
        </button>

        <button
          onClick={() => setView("invitations")}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[16px] transform hover:scale-110 ${
            view === "invitations"
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl animate-pulse"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg border border-white/30"
          }`}
        >
          Invitations
        </button>

        <button
          onClick={() => setView("voice")}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[16px] transform hover:scale-110 ${
            view === "voice"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl animate-pulse"
              : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-lg border border-white/30"
          }`}
        >
          Voice Task
        </button>

        <button
          onClick={() => navigate("/collaboration")}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce"
        >
          Start Collaboration
        </button>
      </div>

      <div className="w-full">
        {view === "suggestions" ? <TopTasks /> : 
         view === "ai" ? <AISuggestion /> : 
         view === "invitations" ? <InvitationsPage /> :
         view === "voice" ? <VoiceRecorder /> :
         <TaskList />}
      </div>

    </div>
  )
}

export default Dashboard