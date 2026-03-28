import { useState } from "react"
import TaskForm from "../components/TaskForm"
import TopTasks from "../components/TopTasks"
import TaskList from "../components/TaskList"
import AISuggestion from "../components/AISuggestion"
import InvitationsList from "../components/InvitationsList"
import NotificationsList from "../components/NotificationsList"
import CollaboratorManager from "../components/CollaboratorManager"

const Dashboard = () => {
  const [view, setView] = useState("suggestions")

  return (
    <div className="p-6 h-full font-sans max-w-5xl mx-auto flex flex-col items-center">

      <div className="flex gap-3 mb-6 w-full max-w-[800px] justify-start text-sm flex-wrap">
        <button
          onClick={() => setView("all")}
          className={`px-4 py-1.5 rounded-md transition font-medium ${
            view === "all"
              ? "bg-[#2383e2] text-white"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          To Do List View
        </button>

        <button
          onClick={() => setView("suggestions")}
          className={`px-4 py-1.5 rounded-md transition font-medium ${
            view === "suggestions"
              ? "bg-[#2383e2] text-white"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          Top 3 Priority
        </button>

        <button
          onClick={() => setView("ai")}
          className={`px-4 py-1.5 rounded-md transition font-medium ${
            view === "ai"
              ? "bg-[#2383e2] text-white"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          AI Suggestion
        </button>

        <button
          onClick={() => setView("invitations")}
          className={`px-4 py-1.5 rounded-md transition font-medium ${
            view === "invitations"
              ? "bg-[#2383e2] text-white"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          Invitations
        </button>

        <button
          onClick={() => setView("notifications")}
          className={`px-4 py-1.5 rounded-md transition font-medium ${
            view === "notifications"
              ? "bg-[#2383e2] text-white"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          Notifications
        </button>
      </div>

      <div className="w-full">
        {view === "suggestions" ? <TopTasks /> : 
         view === "ai" ? <AISuggestion /> : 
         view === "invitations" ? <InvitationsList /> :
         view === "notifications" ? <NotificationsList /> :
         <TaskList />}
      </div>

    </div>
  )
}

export default Dashboard
