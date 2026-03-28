import { useState } from "react"
import SentInvitations from "./SentInvitations"
import ReceivedInvitations from "./ReceivedInvitations"

const InvitationsPage = () => {
  const [activeTab, setActiveTab] = useState("received")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Collaboration Invitations</h2>
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("received")}
            className={`pb-3 px-1 font-medium text-sm transition ${
              activeTab === "received"
                ? "text-white border-b-2 border-[#2383e2]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Received Invitations
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-3 px-1 font-medium text-sm transition ${
              activeTab === "sent"
                ? "text-white border-b-2 border-[#2383e2]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Sent Invitations
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "received" ? <ReceivedInvitations /> : <SentInvitations />}
      </div>
    </div>
  )
}

export default InvitationsPage
