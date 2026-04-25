import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Star, 
  MessageSquare, 
  Settings, 
  ClipboardList, 
  User, 
  TrendingUp,
  Clock,
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

const chartData = [
  { name: 'Mon', appointments: 4 },
  { name: 'Tue', appointments: 7 },
  { name: 'Wed', appointments: 5 },
  { name: 'Thu', appointments: 8 },
  { name: 'Fri', appointments: 6 },
  { name: 'Sat', appointments: 3 },
  { name: 'Sun', appointments: 1 },
];

function DoctorDashboard() {
  const { user } = useContext(AuthContext)
  const [appointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2026-04-22',
      time: '10:00 AM',
      status: 'confirmed',
      reason: 'Checkup',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2026-04-22',
      time: '11:00 AM',
      status: 'confirmed',
      reason: 'Follow-up',
    },
    {
      id: 3,
      patientName: 'Bob Wilson',
      date: '2026-04-20',
      time: '02:30 PM',
      status: 'completed',
      reason: 'Consultation',
    },
  ])

  const todayAppointments = appointments.filter(a => a.status === 'confirmed')
  const totalPatients = new Set(appointments.map(a => a.patientName)).size

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
            <h1 className="display-5 fw-bold text-gradient">Doctor Dashboard</h1>
            <p className="text-muted">Welcome back, Dr. {user?.name || 'Jadon'}. Here's your schedule for today.</p>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-primary-gradient rounded-pill px-4">
              <Calendar className="me-2" size={18} /> New Appointment
            </button>
          </div>
        </motion.div>

        <div className="row g-4">
          {/* Stats Section */}
          <div className="col-12 col-lg-8">
            <div className="row g-4 mb-4">
              {[
                { title: 'Total Patients', value: totalPatients, icon: Users, color: 'primary' },
                { title: "Today's Appointments", value: todayAppointments.length, icon: Calendar, color: 'success' },
                { title: 'Avg Rating', value: '4.8', icon: Star, color: 'warning' },
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

            {/* Performance Chart */}
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Patient Volume Trends</h5>
                <span className="badge bg-primary-soft text-primary small px-2">Last 7 Days</span>
              </div>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', backdropFilter: 'blur(10px)' }}
                    />
                    <Area type="monotone" dataKey="appointments" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAppts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="col-12 col-lg-4">
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <h5 className="fw-bold mb-4">Upcoming Appointments</h5>
              <div className="appointment-timeline">
                {todayAppointments.map((apt, idx) => (
                  <div key={apt.id} className="timeline-item d-flex gap-3 mb-4">
                    <div className="time-indicator">
                      <span className="time-main">{apt.time.split(' ')[0]}</span>
                      <span className="time-sub">{apt.time.split(' ')[1]}</span>
                    </div>
                    <div className="timeline-content flex-grow-1 p-3 bg-white-soft rounded-3 border-start border-primary border-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold mb-0">{apt.patientName}</h6>
                          <p className="text-muted smallest">{apt.reason}</p>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <span className="badge bg-success-soft text-success smallest px-2 py-1">Confirmed</span>
                          <Link to={`/video/${apt.id}`} className="btn btn-primary-soft rounded-circle p-2 d-flex align-items-center justify-content-center">
                            <Video size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline-primary w-100 rounded-pill mt-2">
                View All Schedule <ChevronRight size={16} />
              </button>
            </motion.div>

            <motion.div className="glass-card p-4" variants={itemVariants}>
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="row g-3">
                {[
                  { label: 'My Profile', icon: User, path: '/profile', color: 'primary' },
                  { label: 'Schedule', icon: ClipboardList, path: '/appointments', color: 'success' },
                  { label: 'Messages', icon: MessageSquare, path: '#', color: 'info' },
                  { label: 'Settings', icon: Settings, path: '#', color: 'secondary' },
                ].map((action, i) => (
                  <div key={i} className="col-6">
                    <Link to={action.path} className="quick-action-item text-decoration-none">
                      <div className={`action-icon-bg bg-${action.color}-soft text-${action.color}`}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-dark small fw-medium mt-2 text-center">{action.label}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DoctorDashboard
