import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, CheckCircle, ShieldCheck, ArrowRight, Wallet } from 'lucide-react'
import './Payment.css'

function Checkout() {
  const { appointmentId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [step, setStep] = useState('selection') // selection, processing, success
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  const [details, setDetails] = useState({
    amount: 500, // Hardcoded for demo
    doctorName: 'Dr. Om singh jadon',
    specialty: 'Cardiology'
  })

  const handlePay = async () => {
    setStep('processing')
    
    try {
      // 1. Create order on backend
      const response = await fetch('http://localhost:8080/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: details.amount, appointmentId })
      });
      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_SgUPjPYH2Fwsqt', // Your Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'HospitalCare',
        description: `Consultation with ${details.doctorName}`,
        order_id: order.id,
        handler: function (response) {
          // 3. Verify payment on success
          setStep('success');
          console.log('Payment Successful', response);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#2563eb' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment Error:', error);
      setStep('selection');
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (step === 'success') {
    return (
      <div className="payment-page success">
        <motion.div 
          className="payment-success-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="success-icon">
            <CheckCircle size={80} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Your appointment with {details.doctorName} is confirmed.</p>
          <div className="receipt-box">
            <div className="receipt-row">
              <span>Transaction ID</span>
              <span className="fw-bold">TXN_992144512</span>
            </div>
            <div className="receipt-row">
              <span>Amount Paid</span>
              <span className="fw-bold">₹{details.amount}</span>
            </div>
          </div>
          <button className="btn btn-primary-gradient w-100 rounded-pill py-3" onClick={() => navigate('/patient-dashboard')}>
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <motion.div 
              className="glass-card p-4 p-md-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="payment-header mb-4">
                <h2 className="fw-bold">Checkout</h2>
                <div className="secure-badge">
                  <ShieldCheck size={16} /> 256-bit Secure
                </div>
              </div>

              <div className="order-summary mb-5">
                <div className="d-flex justify-content-between align-items-center p-3 bg-white-soft rounded-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="doctor-avatar-mini">👨‍⚕️</div>
                    <div>
                      <h6 className="fw-bold mb-0">{details.doctorName}</h6>
                      <p className="text-muted smallest mb-0">{details.specialty}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-muted smallest d-block">Consultation Fee</span>
                    <span className="fw-bold text-primary">₹{details.amount}</span>
                  </div>
                </div>
              </div>

              {step === 'selection' ? (
                <div className="payment-selection">
                  <h6 className="fw-bold mb-3">Select Payment Method</h6>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {[
                      { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'primary' },
                      { id: 'upi', label: 'UPI / PhonePe / GPay', icon: Smartphone, color: 'success' },
                      { id: 'wallet', label: 'Digital Wallets', icon: Wallet, color: 'warning' },
                    ].map((method) => (
                      <div 
                        key={method.id}
                        className={`method-card ${paymentMethod === method.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className={`method-icon-box bg-${method.color}-soft text-${method.color}`}>
                          <method.icon size={20} />
                        </div>
                        <span className="fw-bold">{method.label}</span>
                        <div className="selection-dot"></div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn btn-primary-gradient w-100 rounded-pill py-3 shadow-lg"
                    onClick={handlePay}
                  >
                    Pay ₹{details.amount} <ArrowRight className="ms-2" size={18} />
                  </button>
                </div>
              ) : (
                <div className="payment-processing text-center py-5">
                  <div className="spinner-container mb-4">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                  </div>
                  <h5 className="fw-bold">Processing Transaction...</h5>
                  <p className="text-muted">Please do not close the window or hit back.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
