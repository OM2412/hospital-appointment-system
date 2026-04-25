import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import './Chatbot.css'

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Health Assistant. How can I help you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // AI Logic (Rule-based for now, can be connected to LLM later)
    setTimeout(() => {
      processBotResponse(input.toLowerCase())
      setLoading(false)
    }, 800)
  }

  const processBotResponse = (text) => {
    let response = ""
    let suggestedAction = null

    if (text.includes('hello') || text.includes('hi')) {
      response = "Hi there! I can help you find a doctor, check symptoms, or answer questions about our hospital."
    } else if (text.includes('fever') || text.includes('flu') || text.includes('cold')) {
      response = "It sounds like you might have a viral infection. I recommend seeing a General Practitioner. Would you like me to find one for you?"
      suggestedAction = { label: "Find General Practitioner", path: "/search-doctor?specialty=General%20Practice" }
    } else if (text.includes('heart') || text.includes('chest pain')) {
      response = "Chest pain can be serious. Please seek emergency care if it's severe. Otherwise, you should consult a Cardiologist immediately."
      suggestedAction = { label: "Find Cardiologist", path: "/search-doctor?specialty=Cardiology" }
    } else if (text.includes('cancer') || text.includes('tumor') || text.includes('oncology')) {
      response = "I'm sorry to hear that. Cancer requires specialized care. I recommend consulting an Oncologist for a thorough evaluation."
      suggestedAction = { label: "Find Oncologist", path: "/search-doctor?specialty=Oncology" }
    } else if (text.includes('bone') || text.includes('fracture') || text.includes('joint')) {
      response = "For bone or joint issues, you should consult an Orthopedic specialist."
      suggestedAction = { label: "Find Orthopedics", path: "/search-doctor?specialty=Orthopedics" }
    } else if (text.includes('skin') || text.includes('rash') || text.includes('acne')) {
      response = "Skin conditions are best handled by a Dermatologist."
      suggestedAction = { label: "Find Dermatologist", path: "/search-doctor?specialty=Dermatology" }
    } else if (text.includes('appointment') || text.includes('book')) {
      response = "You can book an appointment by finding a doctor in the 'Find Doctor' section. Do you have a specific specialty in mind?"
    } else if (text.includes('rating') || text.includes('best')) {
      response = "Our top-rated doctors are listed in the 'Find Doctor' section. You can filter by ratings there."
    } else {
      response = "I'm not sure I understand. Could you please specify your symptoms or what you're looking for? (e.g., 'I have a headache' or 'Find a heart specialist')"
    }

    setMessages(prev => [...prev, { text: response, sender: 'bot', action: suggestedAction }])
  }

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>AI Health Assistant</h3>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Online</span>
              </div>
            </div>
            <X size={20} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setIsOpen(false)} />
          </div>
          
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.sender}`}>
                <div className="message-content">
                  {m.text}
                  {m.action && (
                    <div className="message-action">
                      <a href={m.action.path}>
                        {m.action.label}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Chatbot
