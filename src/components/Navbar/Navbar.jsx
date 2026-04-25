import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, Search, Calendar, User, HeartPulse } from 'lucide-react'
import NotificationBell from './NotificationBell'
import './Navbar.css'

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const getNavLinks = () => {
    switch (user.role) {
      case 'patient':
        return [
          { label: 'Dashboard', path: '/patient-dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Find Doctor', path: '/search-doctor', icon: <Search size={18} /> },
          { label: 'Appointments', path: '/appointments', icon: <Calendar size={18} /> },
          { label: 'Profile', path: '/profile', icon: <User size={18} /> },
        ]
      case 'doctor':
        return [
          { label: 'Dashboard', path: '/doctor-dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Appointments', path: '/appointments', icon: <Calendar size={18} /> },
          { label: 'Profile', path: '/profile', icon: <User size={18} /> },
        ]
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={18} /> },
        ]
      default:
        return []
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <HeartPulse className="logo-icon" />
          <span>HospitalCare</span>
        </Link>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {getNavLinks().map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="nav-underline" />
                )}
              </Link>
            </li>
          ))}
          
          <div className="nav-separator"></div>

          {user.role === 'patient' && (
            <li className="nav-item">
              <NotificationBell userId={user.id} />
            </li>
          )}
          
          <li className="nav-item user-profile">
            <div className="user-avatar">
              {user.name[0]}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </li>

          <li className="nav-item">
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
