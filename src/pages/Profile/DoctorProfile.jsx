import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { SPECIALTIES } from '../../utils/constants'
import './Profile.css'

function DoctorProfile() {
  const { user } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || 'General Practice',
    qualifications: user?.qualifications || '',
    licenseNumber: 'MD123456',
    experience: '10 years',
    consultationFee: '50',
    availability: 'Mon-Fri: 9AM-5PM',
    clinicAddress: '123 Medical Plaza',
    bio: 'Experienced doctor committed to patient care',
  })

  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess('Profile updated successfully!')
    setIsEditing(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="profile-page">
      <div className="container profile-container">
        <h1>Doctor Profile</h1>

        {success && <div className="success-message">{success}</div>}

        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar">👨‍⚕️</div>
            <div className="profile-info">
              <h2>{formData.name}</h2>
              <p>{formData.specialty}</p>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
            </div>
            <button
              className={`btn ${isEditing ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialty">Specialty</label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    {SPECIALTIES.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Professional Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="licenseNumber">License Number</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="consultationFee">Consultation Fee ($)</label>
                  <input
                    type="number"
                    id="consultationFee"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="qualifications">Qualifications</label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Practice Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="clinicAddress">Clinic Address</label>
                  <input
                    type="text"
                    id="clinicAddress"
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <input
                    type="text"
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Mon-Fri: 9AM-5PM"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
