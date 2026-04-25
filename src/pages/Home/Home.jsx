import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  RefreshCw, 
  FileText, 
  Star, 
  Smartphone,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import './Home.css'

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const features = [
    { icon: <Search className="w-8 h-8" />, title: "Search Doctors", desc: "Find the best doctors by specialty, ratings, and availability" },
    { icon: <Calendar className="w-8 h-8" />, title: "Book Appointments", desc: "Schedule your medical appointments at your convenience" },
    { icon: <RefreshCw className="w-8 h-8" />, title: "Reschedule Easily", desc: "Change your appointment time with just a few clicks" },
    { icon: <FileText className="w-8 h-8" />, title: "Medical Records", desc: "Keep all your medical history in one secure place" },
    { icon: <Star className="w-8 h-8" />, title: "Rate & Review", desc: "Share your experience with other patients" },
    { icon: <Smartphone className="w-8 h-8" />, title: "Mobile Friendly", desc: "Access your appointments on any device" },
  ]

  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          className="hero-content container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hero-badge"
          >
            ✨ Your Health, Our Priority
          </motion.div>
          <h1>Welcome to <span className="text-gradient">HospitalCare</span></h1>
          <p>Experience the next generation of healthcare management. Book and manage your medical appointments with ease and precision.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
        </motion.div>
        
        {/* Floating background elements */}
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
      </section>

      <div className="container">
        <section className="features">
          <div className="section-header">
            <span className="badge">Services</span>
            <h2>Our Premium Services</h2>
            <p>Comprehensive solutions designed for your medical needs</p>
          </div>
          
          <motion.div 
            className="grid grid-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card glass"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="how-it-works glass">
          <div className="section-header">
            <span className="badge">Workflow</span>
            <h2>How It Works</h2>
          </div>
          <div className="steps">
            {[
              { num: "01", title: "Sign Up", desc: "Create your secure account in minutes" },
              { num: "02", title: "Search", desc: "Browse through our verified specialists" },
              { num: "03", title: "Book", desc: "Select a slot that fits your schedule" },
              { num: "04", title: "Confirm", desc: "Instant confirmation and reminders" }
            ].map((step, i) => (
              <div key={i} className="step">
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < 3 && <ArrowRight className="step-arrow" />}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 HospitalCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
