# Hospital Appointment System - Quick Start Guide

## System Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Frontend       │         │  Backend         │
│ (React + Vite)  │◄────────►│ (Spring Boot)    │
│ Port: 3000      │ HTTP    │ Port: 8080       │
│                 │         │                  │
│ Running ✅      │         │ Ready to build   │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   PostgreSQL     │
                            │   Database       │
                            │   Port: 5432     │
                            │   DB: hospital_db│
                            └──────────────────┘
```

## What's Been Completed

✅ **Frontend:**
- React 18 + Vite setup
- All components implemented (Auth, Dashboard, Appointments, Profile)
- Development server running on http://localhost:3000
- Connected to backend API

✅ **Backend Architecture:**
- Hospital model with address, city, state, contact info
- Doctor model with hospital relationship
- 6 sample doctors from 4 hospitals (auto-populated on startup)
- Advanced doctor search API
- Hospital search API
- Sample data initialization

✅ **Database Models:**
- hospitals table
- doctors table with foreign key to hospitals
- Full JPA/Hibernate configuration

## How to Run the System

### Prerequisites
- **Node.js** (v16+) - For frontend ✅ Already installed
- **Java** (17+) - For backend  ⚠️ Needs installation
- **Maven** (3.6+) - For building - ⚠️ Needs installation
- **PostgreSQL** (12+) - For database - ⚠️ Needs installation

### Step 1: Setup PostgreSQL Database
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Start PostgreSQL service
3. Create database:
   ```sql
   CREATE DATABASE hospital_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   ALTER ROLE postgres WITH SUPERUSER;
   ```

### Step 2: Setup and Run Backend
1. Install Java 17+ from https://www.oracle.com/java/technologies/javase-downloads.html
2. Install Maven from https://maven.apache.org/download.cgi
3. Build backend:
   ```bash
   cd backend
   mvn clean install
   ```
4. Run backend:
   ```bash
   mvn spring-boot:run
   ```
   - Backend will be available at: http://localhost:8080
   - Test it: http://localhost:8080/api/hello

### Step 3: Frontend is Already Running ✅
- Frontend is running at: http://localhost:3000
- It's configured to connect to backend at: http://localhost:8080/api

## Testing the Doctor Search

### Via Frontend
1. Open http://localhost:3000 in browser
2. Log in (use any email/password)
3. Go to "Search Doctors" page
4. Search by specialty, city, or hospital

### Via API (using curl or Postman)

**Get all doctors:**
```bash
curl http://localhost:8080/api/doctors
```

**Search doctors by specialty:**
```bash
curl http://localhost:8080/api/doctors/specialty/cardiology
```

**Search doctors by city:**
```bash
curl http://localhost:8080/api/doctors/city/NewYork
```

**Advanced search (POST):**
```bash
curl -X POST http://localhost:8080/api/doctors/search \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "cardiology",
    "city": "NewYork",
    "minRating": 4.5,
    "hospitalId": null
  }'
```

**Get hospitals by city:**
```bash
curl http://localhost:8080/api/hospitals/city/NewYork
```

## Sample Data Available

### Hospitals (Auto-populated):
1. **City General Hospital** (New York, NY) - 2 doctors
2. **St. Mary's Medical Center** (Los Angeles, CA) - 2 doctors
3. **Sunshine Hospital** (Chicago, IL) - 1 doctor
4. **Metropolitan Health Center** (Houston, TX) - 1 doctor

### Doctors by Specialty:
- **Cardiology**: Dr. Sarah Johnson (City General, NY)
- **General Practice**: Dr. Michael Brown (City General, NY)
- **Neurology**: Dr. Emily Davis (St. Mary's, LA)
- **Orthopedics**: Dr. James Wilson (Sunshine, Chicago)
- **Pediatrics**: Dr. Lisa Martinez (St. Mary's, LA)
- **Dermatology**: Dr. Robert Lee (Metropolitan, Houston)

## File Structure

```
MACRO/
├── backend/
│   ├── src/main/java/com/example/hospital/
│   │   ├── models/
│   │   │   ├── Hospital.java          ✅ NEW
│   │   │   ├── Doctor.java            ✏️ UPDATED
│   │   │   ├── Patient.java
│   │   │   └── Appointment.java
│   │   ├── repositories/
│   │   │   ├── HospitalRepository.java ✅ NEW
│   │   │   ├── DoctorRepository.java  ✏️ UPDATED
│   │   │   ├── PatientRepository.java
│   │   │   └── AppointmentRepository.java
│   │   ├── controllers/
│   │   │   ├── HospitalController.java ✅ NEW
│   │   │   └── ApiController.java     ✏️ UPDATED
│   │   ├── dto/
│   │   │   ├── HospitalDTO.java       ✅ NEW
│   │   │   ├── DoctorDTO.java         ✅ NEW
│   │   │   └── DoctorSearchRequest.java ✅ NEW
│   │   └── ...other files
│   └── pom.xml
│
├── src/
│   ├── pages/
│   │   ├── Appointments/
│   │   │   ├── DoctorSearch.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── ...
│   │   └── ...
│   └── utils/
│       └── api.js               ✏️ UPDATED (Vite env var)
│
├── BACKEND_HOSPITAL_SETUP.md    ✅ NEW (detailed setup guide)
├── package.json
├── vite.config.js
└── ... frontend files
```

## Key Endpoints Summary

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`

### Doctors
- GET `/api/doctors` - All doctors
- GET `/api/doctors/{id}` - Doctor by ID
- GET `/api/doctors/specialty/{specialty}` - By specialty
- GET `/api/doctors/city/{city}` - By city
- GET `/api/doctors/city/{city}/specialty/{specialty}` - By city & specialty
- POST `/api/doctors/search` - Advanced search

### Hospitals
- GET `/api/hospitals` - All hospitals
- GET `/api/hospitals/{id}` - Hospital by ID
- GET `/api/hospitals/city/{city}` - By city
- GET `/api/hospitals/state/{state}` - By state

### Appointments
- GET `/api/appointments` - All appointments
- POST `/api/appointments` - Create appointment
- GET `/api/appointments/patient/{patientId}` - Patient's appointments

## Troubleshooting

### "Connection refused" error when accessing http://localhost:8080
- Backend not running. Execute: `cd backend && mvn spring-boot:run`
- Java/Maven not installed. See "Prerequisites" above

### Frontend shows error connecting to API
- Ensure backend is running on port 8080
- Check `.env` file has `VITE_API_URL=http://localhost:8080/api`

### Database connection errors
- PostgreSQL not running. Start PostgreSQL service
- Database "hospital_db" doesn't exist. Create it (see Step 1)

### Port already in use
- Change port in `backend/src/main/resources/application.properties`
  ```
  server.port=8081
  ```

## Next Steps

1. ✅ Frontend is running - visit http://localhost:3000
2. ⚠️ Install Java 17+ 
3. ⚠️ Install Maven
4. ⚠️ Install PostgreSQL
5. 🔧 Build and run backend (see Step 2 above)
6. 🧪 Test doctor search via frontend or API
7. 📊 Add more hospitals/doctors as needed

## Architecture Diagram

```
┌─ User Browser ─────────────────────────────────────────────┐
│                                                             │
│  React Frontend (Vite)                                     │
│  ├─ DoctorSearch.jsx                                       │
│  ├─ BookAppointment.jsx                                    │
│  └─ ProfilePages                                            │
│          │                                                  │
│          │ API Calls (axios)                               │
│          ▼                                                  │
│  http://localhost:3000                                     │
│                                                             │
└─────────────────────┬──────────────────────────────────────┘
                      │ HTTP/REST
                      │ (CORS enabled)
                      ▼
┌─ Application Server ──────────────────────────────────────┐
│                                                            │
│  Spring Boot Backend (Java 25)                            │
│  ├─ ApiController                                         │
│  │   ├─ /api/doctors/*                                    │
│  │   ├─ /api/hospitals/*                                  │
│  │   └─ /api/appointments/*                               │
│  └─ HospitalController                                    │
│      └─ /api/hospitals/*                                  │
│                                                            │
│  http://localhost:8080                                    │
│                                                            │
└──────────────────────┬────────────────────────────────────┘
                       │ JDBC/JPA
                       ▼
┌─ Database Server ────────────────────────────────────────┐
│                                                           │
│  PostgreSQL 12+                                          │
│  ├─ hospital_db                                          │
│  │   ├─ hospitals table                                  │
│  │   ├─ doctors table                                    │
│  │   ├─ patients table                                   │
│  │   └─ appointments table                               │
│                                                           │
│  localhost:5432                                          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Need Help?

See detailed documentation:
- **Backend Setup**: Read `BACKEND_HOSPITAL_SETUP.md`
- **Frontend Report**: Read `frontend-report.md`
- **Deployment Guide**: Read `DEPLOYMENT_GUIDE.md` (for production)
