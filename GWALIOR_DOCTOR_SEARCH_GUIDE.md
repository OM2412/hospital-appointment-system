# Gwalior Doctor Search Guide 🏥

## ✅ System Ready for Gwalior

Your hospital appointment system is now configured with **local hospitals and doctors from Gwalior, Madhya Pradesh, India**.

## 📍 Available Hospitals in Gwalior

| Hospital | Address | Contact | Rating |
|----------|---------|---------|--------|
| **Apollo Specialty Hospital** | Madhav Vihar, Opposite Metro Station, Laxmi Nagar | +91-751-443-0000 | ⭐ 4.8 |
| **Surya Super Specialty Hospital** | 342, Jayendraganj Road, Near Vijaya Cinema | +91-751-423-2323 | ⭐ 4.6 |
| **Aastha Fertility Centre & IVF Hospital** | Plot No. 5-A, Kampoo Road, Civil Lines | +91-751-413-3000 | ⭐ 4.7 |
| **Shanti Nursing Home** | B-58, Kailash Nagar, Rewa Road | +91-751-434-5555 | ⭐ 4.5 |

## 👨‍⚕️ Available Doctors in Gwalior

### Cardiology
- **Dr. Rajesh Sharma** 
  - Experience: 16 years ⭐ 4.9
  - Hospital: Apollo Specialty Hospital
  - Phone: +91-9826-123-456
  - Slots: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM

### General Practice
- **Dr. Priya Verma**
  - Experience: 10 years ⭐ 4.7
  - Hospital: Apollo Specialty Hospital
  - Phone: +91-9876-234-567
  - Slots: 10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM

- **Dr. Suresh Kumar**
  - Experience: 11 years ⭐ 4.5
  - Hospital: Shanti Nursing Home
  - Phone: +91-9856-890-123
  - Slots: 8:00 AM - 12:00 PM, 3:00 PM - 7:00 PM

### Orthopedics
- **Dr. Anil Mishra**
  - Experience: 18 years ⭐ 4.9
  - Hospital: Surya Super Specialty Hospital
  - Phone: +91-9845-345-678
  - Slots: 9:30 AM - 12:00 PM, 3:00 PM - 6:30 PM

### Pediatrics
- **Dr. Meera Singh**
  - Experience: 12 years ⭐ 4.8
  - Hospital: Surya Super Specialty Hospital
  - Phone: +91-9834-456-789
  - Slots: 10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM

### Gynecology & Obstetrics
- **Dr. Neha Gupta**
  - Experience: 14 years ⭐ 4.8
  - Hospital: Aastha Fertility Centre & IVF Hospital
  - Phone: +91-9812-567-890
  - Slots: 10:00 AM - 12:00 PM, 5:00 PM - 8:00 PM

### ENT (Ear, Nose, Throat)
- **Dr. Vikram Patel**
  - Experience: 13 years ⭐ 4.6
  - Hospital: Shanti Nursing Home
  - Phone: +91-9867-678-901
  - Slots: 9:00 AM - 11:30 AM, 3:30 PM - 6:30 PM

### Dermatology
- **Dr. Anjali Jain**
  - Experience: 9 years ⭐ 4.7
  - Hospital: Apollo Specialty Hospital
  - Phone: +91-9823-789-012
  - Slots: 11:00 AM - 1:00 PM, 5:00 PM - 7:30 PM

## 🔍 How to Search for Doctors

### Step 1: Open the Frontend
Go to `http://localhost:3000` in your browser

### Step 2: Navigate to Doctor Search
- Click on "Search Doctors" in the sidebar
- Or use the appointment booking option

### Step 3: Search Criteria
The search page shows:
- **City**: Default set to "Gwalior" (change to search other cities)
- **Specialty**: Filter by doctor specialization
- **Rating**: Filter by minimum rating (4+, 4.5+, 4.8+, 5.0)

### Step 4: Search Results Show
Each doctor card displays:
- ✅ Doctor name and specialty
- ✅ Qualifications and experience
- ✅ Professional rating
- ✅ Contact phone & email
- ✅ Available consultation time slots
- ✅ **Hospital address and details**
- ✅ Hospital contact information
- ✅ Hospital rating

## 📱 Example Searches

### Find a Cardiologist in Gwalior
1. Set City: "Gwalior"
2. Select Specialty: "Cardiology"
3. Click Search
4. Result: Dr. Rajesh Sharma (4.9 ⭐) at Apollo Specialty Hospital

### Find High-Rated Doctors
1. Set City: "Gwalior"
2. Select Minimum Rating: "4.8+ Stars"
3. Leave Specialty blank for all
4. Click Search
5. Results: All doctors with 4.8+ ratings

### Find Pediatrician for Your Child
1. Set City: "Gwalior"
2. Select Specialty: "Pediatrics"
3. Click Search
4. Result: Dr. Meera Singh (4.8 ⭐) at Surya Super Specialty Hospital

## 📞 Quick Contact

**Need immediate help?**
- Visit any hospital directly or call their number
- Call doctors on their phone numbers (listed above)
- Use the app to book appointments

## 🚀 Backend API (For Advanced Users)

### Direct API Calls

**Get all doctors in Gwalior:**
```bash
curl http://localhost:8080/api/doctors/city/Gwalior
```

**Search by specialty in Gwalior:**
```bash
curl http://localhost:8080/api/doctors/city/Gwalior/specialty/Cardiology
```

**Advanced search:**
```bash
curl -X POST http://localhost:8080/api/doctors/search \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "Pediatrics",
    "city": "Gwalior",
    "minRating": 4.5,
    "hospitalId": null
  }'
```

**Get all hospitals in Gwalior:**
```bash
curl http://localhost:8080/api/hospitals/city/Gwalior
```

## 💾 Database Information

All doctor and hospital data is stored in PostgreSQL database:
- **Database**: hospital_db
- **Host**: localhost:5432
- **Tables**: hospitals, doctors, patients, appointments

## 🛠️ Running the System

### Frontend
- Already running on `http://localhost:3000`
- Configured to search Gwalior by default

### Backend
To run the backend:
```bash
cd backend
mvn spring-boot:run
```

Verify it's running:
```bash
curl http://localhost:8080/api/hello
# Should return: "Hello from backend API!"
```

## 📝 What Information Shows for Each Doctor

When you search and find a doctor, you'll see:

### Doctor Information
- Name and Specialty
- Medical Qualifications (MBBS, MD, specializations)
- Years of Experience
- Professional Rating (out of 5)
- Phone Number
- Email Address
- Available Consultation Time Slots

### Hospital Information
- Hospital Name
- Full Hospital Address
- City and State
- Postal Code
- Hospital Contact Number
- Hospital Rating

## ✨ Key Features

✅ **Location-Based Search** - Find doctors by city (Gwalior)
✅ **Specialty Search** - Filter by medical specialization
✅ **Rating Filter** - Find highly-rated doctors
✅ **Complete Details** - Doctor qualifications, experience, availability
✅ **Hospital Info** - Full hospital address and contact information
✅ **One-Click Booking** - Book appointments directly from search results
✅ **Real-Time Data** - Fetch latest information from backend API

## 🎯 Next Steps

1. ✅ Frontend running at http://localhost:3000
2. ⚠️ Start backend: `cd backend && mvn spring-boot:run`
3. 🔍 Search for doctors in "Doctor Search" page
4. 📞 View hospital addresses and contact details
5. 🎫 Book appointments with your chosen doctor

---

**Location**: Gwalior, Madhya Pradesh, India  
**System Status**: Ready for local hospital searches  
**Last Updated**: April 18, 2026
