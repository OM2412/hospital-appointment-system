import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { SPECIALTIES } from '../../utils/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, ArrowRight, ArrowLeft, Check, Lock, Mail, Phone } from 'lucide-react'
import './Auth.css'

function Register() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    specialty: '',
    qualifications: '',
  })
  const [error, setError] = useState('')
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (step === 1 && !formData.role) return
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all personal details')
        return
      }
    }
    setError('')
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Mock registration
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
    }

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', 'mock-token-' + Date.now())
    setUser(user)
    navigate(`/${formData.role}-dashboard`)
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="step-indicator mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
              {step > s ? <Check size={12} /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="fw-bold mb-2">Join HospitalCare</h2>
              <p className="text-muted mb-4 small">First, tell us who you are</p>
              
              <div className="role-selection-grid gap-3 mb-4">
                <div 
                  className={`role-option ${formData.role === 'patient' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({...prev, role: 'patient'}))}
                >
                  <div className="role-icon-box"><User size={24} /></div>
                  <div className="role-text">
                    <h6 className="mb-0 fw-bold">Patient</h6>
                    <span className="smallest text-muted">I want to book consultations</span>
                  </div>
                </div>
                <div 
                  className={`role-option ${formData.role === 'doctor' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({...prev, role: 'doctor'}))}
                >
                  <div className="role-icon-box"><Users size={24} /></div>
                  <div className="role-text">
                    <h6 className="mb-0 fw-bold">Doctor</h6>
                    <span className="smallest text-muted">I want to treat patients</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary-gradient w-100 rounded-pill py-3" onClick={nextStep}>
                Continue <ArrowRight className="ms-2" size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="fw-bold mb-2">Personal Details</h2>
              <p className="text-muted mb-4 small">Tell us a bit more about yourself</p>
              
              <div className="form-group mb-3">
                <label className="small fw-bold">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="small fw-bold">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="small fw-bold">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              {error && <div className="error-message mb-3">{error}</div>}

              <div className="d-flex gap-3">
                <button className="btn btn-light-soft flex-grow-1 rounded-pill py-3" onClick={prevStep}>
                  <ArrowLeft size={18} className="me-2" /> Back
                </button>
                <button className="btn btn-primary-gradient flex-grow-2 rounded-pill py-3" onClick={nextStep}>
                  Next <ArrowRight size={18} className="ms-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="fw-bold mb-2">Secure Account</h2>
              <p className="text-muted mb-4 small">Set your password and you're all set</p>
              
              <div className="form-group mb-3">
                <label className="small fw-bold">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="small fw-bold">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>

              {error && <div className="error-message mb-3">{error}</div>}

              <div className="d-flex gap-3">
                <button className="btn btn-light-soft flex-grow-1 rounded-pill py-3" onClick={prevStep}>
                  <ArrowLeft size={18} className="me-2" /> Back
                </button>
                <button className="btn btn-primary-gradient flex-grow-2 rounded-pill py-3" onClick={handleSubmit}>
                  Create Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="auth-footer mt-4">
          Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
