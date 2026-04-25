import DoctorSearch from './pages/Appointments/DoctorSearch'
import BookAppointment from './pages/Appointments/BookAppointment'
import AppointmentHistory from './pages/Appointments/AppointmentHistory'
import RescheduleAppointment from './pages/Appointments/RescheduleAppointment'
import VideoCall from './pages/Video/VideoCall'
import PatientProfile from './pages/Profile/PatientProfile'
import DoctorProfile from './pages/Profile/DoctorProfile'
import Home from './pages/Home/Home'
import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Chatbot from './components/Chatbot/Chatbot'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import PatientDashboard from './pages/Dashboard/PatientDashboard'
import DoctorDashboard from './pages/Dashboard/DoctorDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'

// Separate component to use useLocation hook
function AnimatedRoutes({ user, logout }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register />} />

        {/* Patient Routes */}
        {user?.role === 'patient' && (
          <>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/search-doctor" element={<DoctorSearch />} />
            <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
            <Route path="/appointments" element={<AppointmentHistory />} />
            <Route path="/reschedule/:appointmentId" element={<RescheduleAppointment />} />
            <Route path="/video/:appointmentId" element={<VideoCall />} />
            <Route path="/profile" element={<PatientProfile />} />
          </>
        )}

        {/* Doctor Routes */}
        {user?.role === 'doctor' && (
          <>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/profile" element={<DoctorProfile />} />
            <Route path="/appointments" element={<AppointmentHistory />} />
          </>
        )}

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </>
        )}

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Simulate checking if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <BrowserRouter>
        {user && <Navbar user={user} onLogout={logout} />}
        <AnimatedRoutes user={user} logout={logout} />
        <Chatbot />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
