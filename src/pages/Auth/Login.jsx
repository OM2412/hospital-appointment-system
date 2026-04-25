import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import apiClient from '../../utils/api'
import axios from 'axios'
import './Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
    otp: '',
  })
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState('password') // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRequestOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email first')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Pointing to the new Node.js Nodemailer service
      await axios.post('http://localhost:5001/api/auth/otp/request', { email: formData.email })
      setOtpSent(true)
      setSuccess('OTP sent successfully to your email!')
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : (err.response?.data?.message || 'Failed to send OTP. Check your email settings.')
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let response
      if (loginMethod === 'password') {
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields')
          setLoading(false)
          return
        }
        
        response = await apiClient.post('/auth/login', { 
          username: formData.email, 
          password: formData.password 
        })
      } else {
        if (!formData.email || !formData.otp) {
          setError('Please enter your email and OTP')
          setLoading(false)
          return
        }
        // Verify OTP via the email service
        const verifyRes = await axios.post('http://localhost:5001/api/auth/otp/verify', { 
          email: formData.email, 
          otp: formData.otp 
        })
        
        if (verifyRes.data.token) {
          // If OTP is valid, the email service returns a mock token
          response = verifyRes
          response.data.role = formData.role // Ensure we use the selected role
        } else {
          throw new Error('Invalid OTP')
        }
      }

      const userData = {
        id: response.data.id || '1',
        email: response.data.email || formData.email,
        name: (response.data.email || formData.email).split('@')[0],
        role: response.data.role || formData.role,
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', response.data.token)
      setUser(userData)
      navigate(`/${userData.role}-dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="text-muted small mb-4">Login to access your medical dashboard</p>
        
        {error && <div className="error-message mb-3">{error}</div>}
        {success && <div className="success-message mb-3">{success}</div>}

        <div className="login-method-tabs mb-4">
          <button 
            type="button" 
            className={`tab-btn ${loginMethod === 'password' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('password'); setError(''); setSuccess(''); }}
          >
            Password
          </button>
          <button 
            type="button" 
            className={`tab-btn ${loginMethod === 'otp' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('otp'); setError(''); setSuccess(''); }}
          >
            Email OTP
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {loginMethod === 'otp' && (
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-sm ms-2"
                  onClick={handleRequestOtp}
                  disabled={loading || otpSent}
                >
                  {otpSent ? 'Resend' : 'Get OTP'}
                </button>
              )}
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="role">Login as</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {loginMethod === 'password' ? (
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div className="form-group mb-3">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit code"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary-gradient w-100 mt-3 py-3 rounded-pill" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer mt-4">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
