import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Appointments.css'

function AppointmentHistory() {
  const [appointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2026-04-25',
      time: '10:00 AM',
      status: 'confirmed',
      reason: 'Check-up',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Brown',
      specialty: 'General Practice',
      date: '2026-04-18',
      time: '02:30 PM',
      status: 'completed',
      reason: 'Follow-up Consultation',
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Davis',
      specialty: 'Dermatology',
      date: '2026-04-10',
      time: '11:00 AM',
      status: 'completed',
      reason: 'Skin Consultation',
    },
    {
      id: 4,
      doctorName: 'Dr. James Wilson',
      specialty: 'Neurology',
      date: '2026-04-05',
      time: '03:00 PM',
      status: 'cancelled',
      reason: 'Check-up',
    },
  ])

  const [filter, setFilter] = useState('all')

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter)

  return (
    <div className="appointments-page">
      <div className="container appointments-container">
        <h1>Appointment History</h1>

        <div className="filters">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button
            className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('confirmed')}
          >
            Upcoming ({appointments.filter(a => a.status === 'confirmed').length})
          </button>
          <button
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="appointments-list">
            {filteredAppointments.map(apt => (
              <div key={apt.id} className={`appointment-list-item ${apt.status}`}>
                <div className="appointment-details-list">
                  <h4>{apt.doctorName}</h4>
                  <p><strong>Specialty:</strong> {apt.specialty}</p>
                  <p><strong>Date & Time:</strong> {apt.date} at {apt.time}</p>
                  <p><strong>Reason:</strong> {apt.reason}</p>
                  <div style={{ marginTop: '10px' }}>
                    <span className={`status ${apt.status}`}>{apt.status}</span>
                  </div>
                </div>
                <div className="appointment-actions-list">
                  {apt.status === 'confirmed' && (
                    <>
                      <Link to={`/reschedule/${apt.id}`} className="btn btn-secondary">
                        Reschedule
                      </Link>
                      <button className="btn btn-danger">
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button className="btn btn-secondary">
                      View Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentHistory
