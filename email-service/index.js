const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory OTP storage
const otpStorage = new Map();

// Configure Nodemailer with the new App Password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'omjadon242@gmail.com',
    pass: 'ayqeqmliowdafvij' // Your new App Password
  }
});

// Request OTP
app.post('/api/auth/otp/request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStorage.set(email, otp);

  const mailOptions = {
    from: 'omjadon242@gmail.com',
    to: email,
    subject: 'Your Hospital Login OTP',
    text: `Hello,\n\nYour 4-digit OTP for logging into the Hospital Appointment System is: ${otp}\n\nThis code will expire in 5 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP ${otp} sent to ${email}`);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email: ' + error.message);
  }
});

// Verify OTP
app.post('/api/auth/otp/verify', (req, res) => {
  const { email, otp } = req.body;
  
  if (otpStorage.has(email) && otpStorage.get(email) === otp) {
    otpStorage.delete(email);
    // Note: In a real app, you'd generate a JWT here
    res.json({ 
      token: 'mock-node-token-' + Date.now(),
      email: email,
      role: 'patient'
    });
  } else {
    res.status(401).send('Invalid or expired OTP');
  }
});

const PORT = 5001; // Run on a different port than Spring Boot
app.listen(PORT, () => {
  console.log(`Email Service running on port ${PORT}`);
});
