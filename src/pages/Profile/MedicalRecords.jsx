import { useState, useEffect } from 'react'
import axios from 'axios'
import { Sparkles, FileText, Download, Loader2 } from 'lucide-react'
import AiSummaryModal from '../../components/AiSummaryModal'

function MedicalRecords({ patientId }) {
  const [records, setRecords] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [recordType, setRecordType] = useState('LAB_REPORT')
  
  // AI Analysis States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [analyzingId, setAnalyzingId] = useState(null)

  useEffect(() => {
    fetchRecords()
  }, [patientId])

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/medical-records/patient/${patientId}`)
      setRecords(response.data)
    } catch (err) {
      console.error('Error fetching medical records:', err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('patientId', patientId)
    formData.append('recordType', recordType)

    try {
      await axios.post('http://localhost:8080/api/medical-records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess('Report uploaded successfully!')
      fetchRecords()
    } catch (err) {
      setError('Failed to upload report. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const downloadRecord = (fileName) => {
    window.open(`http://localhost:8080/api/medical-records/download/${fileName}`, '_blank')
  }

  const handleAnalyze = async (record) => {
    // If already analyzed, just show the modal
    if (record.analysisStatus === 'COMPLETED' && record.aiSummary) {
      setSelectedRecord(record)
      setIsModalOpen(true)
      return
    }

    setAnalyzingId(record.id)
    try {
      const response = await axios.post(`http://localhost:8080/api/medical-records/${record.id}/analyze`)
      const updatedRecord = response.data
      
      // Update local state
      setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r))
      setSelectedRecord(updatedRecord)
      setIsModalOpen(true)
    } catch (err) {
      console.error('AI Analysis failed:', err)
      setError('AI Analysis failed. Please try again.')
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <div className="medical-records-section">
      <div className="section-header">
        <h3>Medical Records & Reports</h3>
        <div className="upload-controls">
          <select 
            value={recordType} 
            onChange={(e) => setRecordType(e.target.value)}
            className="record-type-select"
          >
            <option value="LAB_REPORT">Lab Report</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="SCAN">X-Ray / Scan</option>
            <option value="OTHER">Other</option>
          </select>
          <label className={`btn btn-secondary ${uploading ? 'disabled' : ''}`}>
            {uploading ? 'Uploading...' : 'Upload New Report'}
            <input 
              type="file" 
              onChange={handleFileUpload} 
              disabled={uploading} 
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="records-list">
        {records.length === 0 ? (
          <p className="no-records">No medical records found.</p>
        ) : (
          <div className="grid grid-2">
            {records.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-icon">📄</div>
                <div className="record-details">
                  <h4>{record.fileName}</h4>
                  <p className="record-meta">
                    <span className="type-badge">{record.recordType.replace('_', ' ')}</span>
                    <span className="date">{new Date(record.uploadDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="record-actions">
                  <button 
                    className={`btn-ai ${analyzingId === record.id ? 'analyzing' : ''}`}
                    onClick={() => handleAnalyze(record)}
                    disabled={analyzingId === record.id}
                  >
                    {analyzingId === record.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    AI Insights
                  </button>
                  <button 
                    className="btn-download"
                    onClick={() => downloadRecord(record.filePath)}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AiSummaryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={selectedRecord?.aiSummary}
        fileName={selectedRecord?.fileName}
        status={selectedRecord?.analysisStatus}
      />
    </div>
  )
}

export default MedicalRecords
