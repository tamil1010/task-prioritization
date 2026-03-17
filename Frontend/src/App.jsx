import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import CalendarView from "./pages/CalendarView"
import { TaskProvider } from "./context/TaskContext"

function App() {
  return (
    <TaskProvider>
      <Router>

        <div className="min-h-screen bg-gray-100">

          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>

        </div>

      </Router>
    </TaskProvider>
  )
}

export default App