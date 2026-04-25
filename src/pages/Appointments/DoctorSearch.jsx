import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SPECIALTIES } from '../../utils/constants'
import apiClient from '../../utils/api'
import './Appointments.css'

function DoctorSearch() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filters, setFilters] = useState({
    specialty: '',
    city: 'Gwalior', // Default to Gwalior
    minRating: 0,
  })

  const navigate = useNavigate()

  // Fetch doctors when component mounts or filters change
  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build search query based on filters
      let endpoint = '/doctors'
      
      if (filters.specialty && filters.city) {
        endpoint = `/doctors/city/${filters.city}/specialty/${filters.specialty}`
      } else if (filters.city) {
        endpoint = `/doctors/city/${filters.city}`
      } else if (filters.specialty) {
        endpoint = `/doctors/specialty/${filters.specialty}`
      }

      const response = await apiClient.get(endpoint)
      let data = response.data

      // Apply minimum rating filter
      if (filters.minRating) {
        data = data.filter(doctor => doctor.rating >= filters.minRating)
      }

      setDoctors(data)
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setError('Failed to fetch doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minRating' ? Number(value) : value,
    }))
  }

  const handleSearch = () => {
    fetchDoctors()
  }

  const handleClearFilters = () => {
    setFilters({
      specialty: '',
      city: 'Gwalior',
      minRating: 0,
    })
  }

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`)
  }

  return (
    <div className="appointments-page">
      <div className="container appointments-container">
        <h1>🏥 Find a Doctor Near You</h1>

        <div className="search-section">
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="city">📍 City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city (e.g., Gwalior)"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="specialty">🏨 Specialty</label>
              <select
                id="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Practice">General Practice</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                <option value="ENT (Ear, Nose, Throat)">ENT (Ear, Nose, Throat)</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                {SPECIALTIES.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="minRating">⭐ Minimum Rating</label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSearch}
            >
              🔍 Search
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          {!loading && (
            <div className="results-count">
              Found <strong>{doctors.length}</strong> doctor(s) in <strong>{filters.city}</strong>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">
            <p>Loading doctors...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="doctors-grid">
            {doctors.length > 0 ? (
              doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p className="specialty">{doctor.specialty}</p>
                    </div>
                  </div>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <span className="label">📜 Qualifications:</span>
                      <span className="value">{doctor.qualifications || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">📅 Experience:</span>
                      <span className="value">{doctor.yearsOfExperience} years</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">⭐ Rating:</span>
                      <span className="value rating">{doctor.rating}/5.0</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">📞 Phone:</span>
                      <span className="value">{doctor.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">📧 Email:</span>
                      <span className="value">{doctor.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">⏰ Available Slots:</span>
                      <span className="value">{doctor.availableSlots}</span>
                    </div>
                  </div>

                  {doctor.hospital && (
                    <div className="hospital-section">
                      <h4>🏥 Hospital Details</h4>
                      <div className="hospital-info">
                        <div className="hospital-item">
                          <span className="label">Hospital:</span>
                          <span className="value"><strong>{doctor.hospital.name}</strong></span>
                        </div>
                        <div className="hospital-item">
                          <span className="label">📍 Address:</span>
                          <span className="value">{doctor.hospital.address}</span>
                        </div>
                        <div className="hospital-item">
                          <span className="label">City:</span>
                          <span className="value">{doctor.hospital.city}, {doctor.hospital.state}</span>
                        </div>
                        <div className="hospital-item">
                          <span className="label">📮 Postal Code:</span>
                          <span className="value">{doctor.hospital.postalCode}</span>
                        </div>
                        <div className="hospital-item">
                          <span className="label">📞 Hospital Phone:</span>
                          <span className="value">{doctor.hospital.phoneNumber}</span>
                        </div>
                        <div className="hospital-item">
                          <span className="label">⭐ Hospital Rating:</span>
                          <span className="value">{doctor.hospital.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '10px' }}
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    Book Appointment
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No doctors found matching your criteria</p>
                <p>Try searching with different filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorSearch
