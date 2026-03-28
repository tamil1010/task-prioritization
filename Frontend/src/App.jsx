import { BrowserRouter as Router, Routes, Route } from "react-router-dom"



import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"

import CalendarView from "./pages/CalendarView"

import CollaborationPage from "./pages/CollaborationPage"

import Login from "./pages/Login"

import Signup from "./pages/Signup"

import ProtectedRoute from "./components/ProtectedRoute"



import { TaskProvider } from "./context/TaskContext"

import { AuthProvider } from "./context/AuthContext"



import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

import "./styles/ai-image-bg.css"



function App() {

  return (

    <AuthProvider>

      <TaskProvider>

        <Router>

          <div className="min-h-screen text-white font-[Poppins] relative overflow-hidden">

            {/* AI Image Background */}

            <div className="absolute inset-0">

              {/* Background Image */}

              <div 

                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-slow"

                style={{

                  backgroundImage: `url(/first-ai-image.jpg)`,

                  backgroundSize: 'cover',

                  backgroundPosition: 'center',

                  backgroundRepeat: 'no-repeat',

                  imageRendering: 'crisp-edges',

                  filter: 'contrast(1.05) brightness(0.95) saturate(1.05)'

                }}

              ></div>

              

              {/* HD Enhancement overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>

              

              {/* Animated overlay for image effects */}

              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/25 to-blue-400/20 animate-pulse-slow"></div>

              

              {/* Enhanced moving light effects */}

              <div className="absolute inset-0 overflow-hidden">

                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/40 rounded-full blur-3xl animate-slide-diagonal"></div>

                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/40 rounded-full blur-3xl animate-slide-diagonal-reverse"></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400/30 rounded-full blur-3xl animate-pulse-slow"></div>

                

                {/* Additional moving orbs */}

                <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-float-orb-1"></div>

                <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-700/30 rounded-full blur-2xl animate-float-orb-2"></div>

                <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-blue-300/25 rounded-full blur-2xl animate-float-orb-3"></div>

              </div>

              

              {/* Particle field animation */}

              <div className="absolute inset-0 overflow-hidden">

                {[...Array(30)].map((_, i) => (

                  <div

                    key={`particle-field-${i}`}

                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-particle-field"

                    style={{

                      left: `${Math.random() * 100}%`,

                      top: `${Math.random() * 100}%`,

                      animationDelay: `${Math.random() * 8}s`,

                      animationDuration: `${4 + Math.random() * 6}s`

                    }}

                  ></div>

                ))}

              </div>

              

              {/* Wave animation overlay */}

              <div className="absolute inset-0 overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-wave-1"></div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/15 to-transparent animate-wave-2"></div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/15 to-transparent animate-wave-3"></div>

              </div>

              

              {/* Dark overlay for better readability */}

              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-950/60 to-black/80"></div>

              

              {/* AI-Themed Animated Overlay */}

              <div className="absolute inset-0 overflow-hidden">

                {/* Neural Network Animation without central brain */}

                <div className="absolute inset-0 opacity-60">

                  <div className="relative w-full h-full">

                    {/* Floating neural particles */}

                    {[...Array(20)].map((_, i) => (

                      <div

                        key={`particle-${i}`}

                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/70 to-blue-600/70 rounded-full animate-float-particle"

                        style={{

                          left: `${Math.random() * 100}%`,

                          top: `${Math.random() * 100}%`,

                          animationDelay: `${Math.random() * 5}s`,

                          animationDuration: `${3 + Math.random() * 4}s`

                        }}

                      ></div>

                    ))}

                    

                    {/* Neural network lines */}

                    <svg className="absolute inset-0 w-full h-full">

                      <defs>

                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">

                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />

                          <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />

                          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.6" />

                        </linearGradient>

                      </defs>

                      

                      {/* Connection lines */}

                      {[...Array(15)].map((_, i) => (

                        <line

                          key={`line-${i}`}

                          x1={`${Math.random() * 100}%`}

                          y1={`${Math.random() * 100}%`}

                          x2={`${Math.random() * 100}%`}

                          y2={`${Math.random() * 100}%`}

                          stroke="url(#lineGradient)"

                          strokeWidth="1"

                          className="animate-pulse-line"

                          style={{

                            animationDelay: `${Math.random() * 3}s`

                          }}

                        />

                      ))}

                    </svg>

                    

                    {/* Data flow particles */}

                    {[...Array(10)].map((_, i) => (

                      <div

                        key={`data-${i}`}

                        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-data-flow"

                        style={{

                          left: `${Math.random() * 100}%`,

                          top: `${Math.random() * 100}%`,

                          animationDelay: `${Math.random() * 4}s`,

                          animationDuration: `${2 + Math.random() * 3}s`

                        }}

                      ></div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

            

            <div className="relative z-10">

              <Navbar />

              <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />

                <Route path="/collaboration" element={<ProtectedRoute><CollaborationPage /></ProtectedRoute>} />

              </Routes>

              <ToastContainer

                position="top-right"

                autoClose={2000}

                theme="dark"

                newestOnTop

                pauseOnHover

                style={{ zIndex: 99999 }}

                toastStyle={{

                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 50%, rgba(6, 182, 212, 0.9) 100%)",

                  color: "#ffffff",

                  border: "1px solid rgba(255, 255, 255, 0.3)",

                  borderRadius: "16px",

                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.4)",

                  backdropFilter: "blur(12px)"

                }}

              />

            </div>

          </div>

        </Router>

      </TaskProvider>

    </AuthProvider>

  )

}



export default App