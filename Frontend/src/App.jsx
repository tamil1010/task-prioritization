import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import CalendarView from "./pages/CalendarView"
import { TaskProvider } from "./context/TaskContext"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-[#020617] text-gray-300 font-[Poppins]">

          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>

          {/* ✅ TOAST FIXED */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="dark"
            newestOnTop
            pauseOnHover
            style={{ zIndex: 99999 }}
            toastStyle={{
              background: "#0F172A",
              color: "#E2E8F0",
              border: "1px solid #06B6D4"
            }}
          />

        </div>
      </Router>
    </TaskProvider>
  )
}

export default App