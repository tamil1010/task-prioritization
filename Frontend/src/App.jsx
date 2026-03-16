import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import { TaskProvider } from "./context/TaskContext"

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Dashboard />
      </div>
    </TaskProvider>
  )
}

export default App