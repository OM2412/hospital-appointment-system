import { useState, useEffect } from 'react'
import apiClient from '../../utils/api'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  Activity, 
  Settings, 
  FileBarChart, 
  ShieldCheck,
  Server,
  Mail,
  Smartphone,
  ChevronRight
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import './Dashboard.css'

const revenueData = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 19000 },
  { name: 'Wed', revenue: 15000 },
  { name: 'Thu', revenue: 22000 },
  { name: 'Fri', revenue: 18000 },
  { name: 'Sat', revenue: 10000 },
  { name: 'Sun', revenue: 8000 },
];

function AdminDashboard() {
  const [stats] = useState({
    totalPatients: 1250,
    totalDoctors: 85,
    totalAppointments: 3420,
    totalRevenue: 125450,
    appointmentsToday: 42,
    completedAppointmentsPercentage: 94,
  })

  const [healthStatus, setHealthStatus] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await apiClient.get('/system/health')
        setHealthStatus(response.data)
      } catch (error) {
        console.error('Error fetching health status:', error)
      } finally {
        setLoadingHealth(false)
      }
    }
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  const iconMap = {
    Server: Server,
    Activity: Activity,
    Mail: Mail,
    Smartphone: Smartphone
  }

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
            <h1 className="display-5 fw-bold text-gradient">Admin Command Center</h1>
            <p className="text-muted">Global system overview and administrative controls.</p>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-primary-gradient rounded-pill px-4">
              <ShieldCheck className="me-2" size={18} /> System Audit
            </button>
          </div>
        </motion.div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {/* Main Stats Grid */}
            <div className="row g-4 mb-4">
              {[
                { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'primary' },
                { title: 'Active Doctors', value: stats.totalDoctors, icon: Activity, color: 'success' },
                { title: 'Total Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'warning' },
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

            {/* Revenue Chart */}
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Revenue Overview</h5>
                <div className="d-flex gap-2">
                  <span className="badge bg-success-soft text-success small px-2">+12.5% vs last week</span>
                </div>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', backdropFilter: 'blur(10px)' }}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-lg-4">
            {/* System Status Sidebar */}
            <motion.div className="glass-card p-4 mb-4" variants={itemVariants}>
              <h5 className="fw-bold mb-4">System Health</h5>
              <div className="d-flex flex-column gap-1">
                {loadingHealth ? (
                  <div className="text-center py-4 text-muted small">
                    <Activity className="spinner-rotate me-2" size={16} /> 
                    Syncing system vitals...
                  </div>
                ) : (
                  healthStatus.map((item, i) => {
                    const Icon = iconMap[item.icon] || Activity;
                    return (
                      <div key={i} className="health-monitor-item">
                        <div className="health-monitor-left">
                          <div className={`text-${item.color}`}>
                            <Icon size={18} />
                          </div>
                          <span className="health-monitor-text">{item.label}</span>
                        </div>
                        <span className={`badge-status bg-${item.color}-soft text-${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>

            {/* Admin Actions */}
            <motion.div className="glass-card p-4" variants={itemVariants}>
              <h5 className="fw-bold mb-4">Administrative Hub</h5>
              <div className="row g-3">
                {[
                  { label: 'Add Doctor', icon: UserPlus, color: 'primary' },
                  { label: 'Reports', icon: FileBarChart, color: 'success' },
                  { label: 'Settings', icon: Settings, color: 'info' },
                  { label: 'Manage Users', icon: Users, color: 'secondary' },
                ].map((action, i) => (
                  <div key={i} className="col-6">
                    <div className="quick-action-item cursor-pointer">
                      <div className={`action-icon-bg bg-${action.color}-soft text-${action.color}`}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-dark small fw-medium mt-2">{action.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline-primary w-100 rounded-pill mt-4">
                Global Settings <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
