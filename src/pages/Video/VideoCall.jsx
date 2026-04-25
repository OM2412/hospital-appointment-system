import { useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { PhoneOff, Video, Mic, MessageSquare, User } from 'lucide-react'
import './Video.css'

function VideoCall() {
  const { appointmentId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const jitsiContainerRef = useRef(null)

  useEffect(() => {
    // Load Jitsi script dynamically
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      const domain = 'meet.jit.si'
      const options = {
        roomName: `Hospital-Consultation-${appointmentId}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user?.name || 'User'
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fmsert', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'e2ee'
          ],
        }
      }
      
      const api = new window.JitsiMeetExternalAPI(domain, options)
      
      api.addEventListener('videoConferenceLeft', () => {
        navigate(`/${user?.role || 'patient'}-dashboard`)
      })

      return () => api.dispose()
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [appointmentId, user, navigate])

  return (
    <motion.div 
      className="video-call-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="video-header">
        <div className="consultation-info">
          <div className="status-dot"></div>
          <div>
            <h5 className="mb-0 fw-bold">Live Consultation</h5>
            <p className="text-muted smallest mb-0">ID: {appointmentId}</p>
          </div>
        </div>
        <button className="btn-exit" onClick={() => navigate(-1)}>
          <PhoneOff size={18} className="me-2" /> End Session
        </button>
      </div>

      <div className="video-main">
        <div ref={jitsiContainerRef} className="jitsi-container"></div>
      </div>

      <div className="video-footer">
        <div className="user-badge">
          <div className="avatar-mini">
            {user?.name?.charAt(0) || <User size={14}/>}
          </div>
          <span>{user?.name} ({user?.role})</span>
        </div>
        <div className="controls-hint">
          <span className="badge bg-primary-soft text-primary">SECURE & ENCRYPTED</span>
        </div>
      </div>
    </motion.div>
  )
}

export default VideoCall
