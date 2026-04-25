import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TIME_SLOTS } from '../../utils/constants'
import './Appointments.css'

function RescheduleAppointment() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mock appointment data
  const appointment = {
    id: appointmentId,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    currentDate: '2026-04-25',
    currentTime: '10:00 AM',
    availableDates: ['2026-04-26', '2026-04-27', '2026-04-28', '2026-05-01'],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.date || !formData.time) {
      setError('Please select new date and time')
      return
    }

    // Simulate API call
    setSuccess('Appointment rescheduled successfully!')
    setTimeout(() => {
      navigate('/appointments')
    }, 2000)
  }

  return (
    <div className="appointments-page">
      <div className="container appointments-container" style={{ maxWidth: '600px' }}>
        <h1>Reschedule Appointment</h1>

        <div className="doctor-info-card">
          <div className="doctor-avatar">👨‍⚕️</div>
          <div>
            <h3>{appointment.doctorName}</h3>
            <p>{appointment.specialty}</p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
              Current: {appointment.currentDate} at {appointment.currentTime}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="date">Select New Date *</label>
            <select
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            >
              <option value="">Choose a date</option>
              {appointment.availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time">Select New Time *</label>
            {formData.date ? (
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              >
                <option value="">Choose a time slot</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value="Select date first"
                disabled
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Rescheduling</label>
            <textarea
              id="reason"
              name="reason"
              placeholder="Optional: Tell us why you're rescheduling"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/appointments')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm New Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RescheduleAppointment
