import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import apiClient from '../../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  CheckCircle, 
  Activity, 
  Search, 
  ClipboardList, 
  User, 
  FileText,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
  Video
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import './Dashboard.css'

const healthData = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 88 },
  { name: 'Mar', value: 92 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 95 },
  { name: 'Jun', value: 94 },
]

function PatientDashboard() {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch real data from our new API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Using the logged in user's email
        const userEmail = user?.email || 'omjad@example.com'
        const response = await apiClient.get(`/dashboard/patient/${userEmail}`)
        
        // Map JPA objects to our UI format
        const mappedData = (response.data.appointments || []).map(apt => ({
          id: apt.id,
          doctorName: apt.doctor ? apt.doctor.name : 'Unknown Doctor',
          specialty: apt.doctor ? apt.doctor.specialty : 'General',
          date: apt.date,
          time: apt.time,
          status: apt.status || 'confirmed',
          location: (apt.doctor && apt.doctor.hospital) ? apt.doctor.hospital.name : 'Main Clinic'
        }))

        setAppointments(mappedData)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError('Failed to load real-time care data.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'confirmed' || (a.status && a.status.toLowerCase() === 'confirmed')
  )
  const pastAppointments = appointments.filter(a => 
    a.status === 'completed' || (a.status && a.status.toLowerCase() === 'completed')
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      className="dashboard-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container py-5">
        <motion.div className="dashboard-header mb-5" variants={itemVariants}>
          <div>
            <h1 className="display-5 fw-bold">Welcome back, <span className="text-gradient">{user?.name || 'Om Jadon'}</span></h1>
            <p className="text-muted">Here's a summary of your health and upcoming care.</p>
          </div>
          <div className="d-flex gap-3">
            <Link to="/search-doctor" className="btn btn-primary-gradient rounded-pill px-4 d-flex align-items-center text-decoration-none">
              <Search className="me-2" size={18} /> Book Appointment
            </Link>
          </div>
        </motion.div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {/* Stats Row */}
            <div className="row g-4 mb-4">
              {[
                { title: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'primary' },
                { title: 'Completed', value: pastAppointments.length, icon: CheckCircle, color: 'success' },
                { title: 'Health Score', value: '94%', icon: Activity, color: 'info' },
              ].map((stat, i) => (
                <div key={i} className="col-md-4">
                  <motion.div className="glass-card" variants={itemVariants}>
                    <div className="stats-card-content">
                      <div className={`icon-box bg-${stat.color}-soft text-${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <div className="stat-text-group">
                        <h3>{stat.value}</h3>
                        <p>{stat.title}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Health Chart */}
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Health Progress Trends</h5>
                <span className="badge bg-primary-soft text-primary small px-2">Last 6 Months</span>
              </div>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={healthData}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', backdropFilter: 'blur(10px)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-lg-4">
            {/* Advanced Service Hub */}
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Service Hub</h5>
                <span className="badge bg-primary-soft text-primary smallest px-2">ADVANCED</span>
              </div>
              <div className="d-flex flex-column gap-3">
                {[
                  { label: 'Book Appointment', desc: 'Find specialized doctors nearby', icon: Search, path: '/search-doctor', color: 'primary' },
                  { label: 'My Schedules', desc: 'View and manage upcoming care', icon: ClipboardList, path: '/appointments', color: 'success' },
                  { label: 'Medical Records', desc: 'Secure access to your health history', icon: FileText, path: '#', color: 'secondary' },
                  { label: 'Health Profile', desc: 'Update your personal vitals', icon: User, path: '/profile', color: 'info' },
                ].map((action, i) => (
                  <Link key={i} to={action.path} className="advanced-action-card text-decoration-none">
                    <div className={`action-icon-box bg-${action.color}-soft text-${action.color}`}>
                      <action.icon size={22} />
                    </div>
                    <div className="action-details">
                      <h6 className="fw-bold mb-0 text-dark">{action.label}</h6>
                      <p className="text-muted smallest mb-0">{action.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted ms-auto arrow-reveal" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Next Care Event */}
            <motion.div className="glass-card p-4" variants={itemVariants}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Next Care Event</h5>
                <div className="live-indicator">
                  <span className="pulse-dot"></span>
                  <span className="text-muted smallest fw-bold uppercase">Scheduled</span>
                </div>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="appointment-focus-card">
                  <div className="appointment-header mb-3">
                    <div className="doctor-meta">
                      <h6 className="fw-bold mb-1 text-dark">{upcomingAppointments[0].doctorName}</h6>
                      <p className="text-primary smallest fw-bold mb-0 text-uppercase letter-spacing-1">
                        {upcomingAppointments[0].specialty}
                      </p>
                    </div>
                    <span className="badge-status bg-success-soft text-success">Confirmed</span>
                  </div>

                  <div className="appointment-details-grid mb-4">
                    <div className="detail-row">
                      <div className="detail-icon bg-primary-soft text-primary">
                        <Calendar size={14} />
                      </div>
                      <div className="detail-info">
                        <span className="text-muted smallest d-block">Date</span>
                        <span className="fw-bold small">{upcomingAppointments[0].date}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-icon bg-info-soft text-info">
                        <Clock size={14} />
                      </div>
                      <div className="detail-info">
                        <span className="text-muted smallest d-block">Time</span>
                        <span className="fw-bold small">{upcomingAppointments[0].time}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-icon bg-warning-soft text-warning">
                        <MapPin size={14} />
                      </div>
                      <div className="detail-info">
                        <span className="text-muted smallest d-block">Location</span>
                        <span className="fw-bold small">{upcomingAppointments[0].location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary-gradient flex-grow-1 rounded-pill py-2 shadow-sm">
                      Manage Schedule
                    </button>
                    <Link to={`/video/${upcomingAppointments[0].id}`} className="btn btn-success-soft rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm">
                      <Video size={20} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <Calendar className="text-muted mb-3 opacity-20" size={48} />
                  <p className="text-muted small">No upcoming appointments found.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PatientDashboard
