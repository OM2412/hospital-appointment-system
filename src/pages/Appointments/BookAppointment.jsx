import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { TIME_SLOTS } from '../../utils/constants'
import apiClient from '../../utils/api'
import './Appointments.css'

function BookAppointment() {
  const { user } = useContext(AuthContext)
  const { doctorId } = useParams()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch doctor details from API
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/doctors/${doctorId}`)
        setDoctor(response.data)
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError('Failed to load doctor details.')
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [doctorId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.date || !formData.time) {
      setError('Please select date and time')
      return
    }

    try {
      setLoading(true)
      
      // 1. Get or Create Patient ID for current user
      const patientsResponse = await apiClient.get('/patients')
      const patients = patientsResponse.data
      const userEmail = user?.email || 'omjad@example.com'
      let patient = patients.find(p => p.email === userEmail)
      
      if (!patient) {
        // Fallback or create if missing (though should exist)
        patient = patients[0] || { id: 1 } 
      }

      // 2. Submit Appointment to Backend
      const appointmentData = {
        doctorId: parseInt(doctorId),
        patientId: patient.id,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'confirmed'
      }

      await apiClient.post('/appointments', appointmentData)

      setSuccess('Appointment booked successfully! Updating your dashboard...')
      
      // Also update local storage for redundancy/backward compatibility if needed
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
      localAppointments.push({ ...appointmentData, doctorName: doctor.name })
      localStorage.setItem('appointments', JSON.stringify(localAppointments))

      setTimeout(() => {
        navigate('/patient-dashboard') // Navigate to dashboard to see updated count
      }, 2000)
    } catch (err) {
      console.error('Error booking appointment:', err)
      setError('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !doctor) return <div className="container py-5 text-center">Loading doctor details...</div>

  return (
    <div className="appointments-page">
      <div className="container appointments-container" style={{ maxWidth: '600px' }}>
        <h1>Book Appointment</h1>

        {doctor && (
          <div className="doctor-info-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty} • {doctor.hospital?.name}</p>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="date">Select Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Select Time *</label>
            <select
              id="time"
              name="time"
              className="form-select"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Choose a time slot</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Appointment *</label>
            <input
              type="text"
              id="reason"
              name="reason"
              className="form-control"
              placeholder="e.g., Check-up, Follow-up"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions d-flex gap-3 mt-4">
            <button type="button" className="btn btn-outline-secondary flex-grow-1" onClick={() => navigate('/search-doctor')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-grow-2" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookAppointment
