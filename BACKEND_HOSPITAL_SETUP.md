# Backend Setup - Hospital & Doctor Search Implementation

## Overview
Backend has been enhanced with hospital management and doctor search capabilities. The system now supports:
- Hospital database with local hospital data
- Doctor-Hospital relationships
- Advanced doctor search by specialty, city, hospital, and rating
- Hospital location-based queries

## What's Been Implemented

### 1. **New Models**
- **Hospital.java** - Represents hospitals with:
  - Basic info: name, address, city, state, postal code
  - Contact: phone number
  - Metadata: description, rating
  - Relationships: one-to-many with Doctors

- **Updated Doctor.java** - Enhanced with:
  - Hospital reference (foreign key relationship)
  - Professional details: qualifications, years of experience
  - Ratings and contact information
  - Available time slots

### 2. **Repositories**
- **HospitalRepository** - Query methods for hospitals by:
  - City
  - State
  - City + State combination
  
- **Updated DoctorRepository** - Extended with search methods:
  - By hospital
  - By specialty and hospital
  - By hospital city
  - By city and specialty (ignoring case)

### 3. **DTOs (Data Transfer Objects)**
- **HospitalDTO** - For hospital responses with doctor count
- **DoctorDTO** - For doctor responses including hospital info
- **DoctorSearchRequest** - For search criteria (specialty, city, hospital, minRating)

### 4. **Controllers**

#### HospitalController (`/api/hospitals`)
- GET `/api/hospitals` - All hospitals
- GET `/api/hospitals/{id}` - Hospital by ID
- GET `/api/hospitals/city/{city}` - Hospitals in a city
- GET `/api/hospitals/state/{state}` - Hospitals in a state
- GET `/api/hospitals/city/{city}/state/{state}` - Hospitals by city & state
- POST `/api/hospitals` - Create hospital
- PUT `/api/hospitals/{id}` - Update hospital
- DELETE `/api/hospitals/{id}` - Delete hospital

#### Updated ApiController (Enhanced endpoints)

**Doctor Endpoints:**
- GET `/api/doctors` - All doctors with details
- GET `/api/doctors/{id}` - Doctor by ID
- GET `/api/doctors/specialty/{specialty}` - By specialty (case-insensitive)
- GET `/api/doctors/city/{city}` - By city
- GET `/api/doctors/city/{city}/specialty/{specialty}` - By city & specialty
- POST `/api/doctors/search` - Advanced search with multiple filters

**Hospital Endpoints:**
- GET `/api/hospitals` - All hospitals
- GET `/api/hospitals/{id}` - Hospital by ID
- GET `/api/hospitals/city/{city}` - Hospitals by city
- GET `/api/hospitals/state/{state}` - Hospitals by state

### 5. **Sample Data Initialization**

On application startup, the following data is auto-populated:

**Hospitals:**
1. **City General Hospital** (New York, NY) - Rating: 4.8
2. **St. Mary's Medical Center** (Los Angeles, CA) - Rating: 4.6
3. **Sunshine Hospital** (Chicago, IL) - Rating: 4.5
4. **Metropolitan Health Center** (Houston, TX) - Rating: 4.7

**Doctors (6 total):**
- Dr. Sarah Johnson (Cardiology, City General) - 15 years experience, 4.9 rating
- Dr. Michael Brown (General Practice, City General) - 10 years, 4.7 rating
- Dr. Emily Davis (Neurology, St. Mary's) - 12 years, 4.8 rating
- Dr. James Wilson (Orthopedics, Sunshine) - 18 years, 4.9 rating
- Dr. Lisa Martinez (Pediatrics, St. Mary's) - 8 years, 4.6 rating
- Dr. Robert Lee (Dermatology, Metropolitan) - 14 years, 4.7 rating

## Setup Instructions

### Prerequisites
- Java 17+ (pom.xml specifies Java 25)
- Maven 3.6+
- PostgreSQL 12+

### Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/

2. **Create Database**
   ```sql
   CREATE DATABASE hospital_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   ALTER ROLE postgres WITH SUPERUSER;
   ```

3. **Verify connection in `application.properties`**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.hibernate.ddl-auto=update
   ```

### Building & Running the Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   OR
   ```bash
   mvn clean package
   java -jar target/hospital-backend-0.0.1-SNAPSHOT.war
   ```

4. **Verify Backend is Running**
   - Server runs on: `http://localhost:8080`
   - Test endpoint: `http://localhost:8080/api/hello`
   - Should return: "Hello from backend API!"

## API Usage Examples

### Doctor Search Examples

**1. Search doctors by specialty:**
```
GET /api/doctors/specialty/cardiology
```

**2. Search doctors in a city:**
```
GET /api/doctors/city/NewYork
```

**3. Advanced search with filters:**
```
POST /api/doctors/search
Content-Type: application/json

{
  "specialty": "cardiology",
  "city": "NewYork",
  "minRating": 4.5,
  "hospitalId": null
}
```

**4. Get all doctors with hospital details:**
```
GET /api/doctors
```

Response example:
```json
[
  {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "specialty": "Cardiology",
    "qualifications": "MD, Board Certified in Cardiology",
    "yearsOfExperience": 15,
    "rating": 4.9,
    "email": "sarah.johnson@cityhospital.com",
    "availableSlots": "9:00-5:00",
    "hospital": {
      "id": 1,
      "name": "City General Hospital",
      "city": "New York",
      "state": "NY",
      "rating": 4.8,
      "doctorCount": 2
    }
  }
]
```

### Hospital Search Examples

**1. Get all hospitals:**
```
GET /api/hospitals
```

**2. Hospitals by city:**
```
GET /api/hospitals/city/NewYork
```

**3. Hospitals by state:**
```
GET /api/hospitals/state/NY
```

## Database Schema

### hospitals table
```sql
CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  description TEXT,
  rating DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### doctors table
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  hospital_id BIGINT NOT NULL,
  qualifications VARCHAR(255),
  years_of_experience INT,
  rating DOUBLE PRECISION,
  phone_number VARCHAR(20),
  email VARCHAR(100),
  available_slots VARCHAR(100),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

## Troubleshooting

### Error: "Connection refused" for database
- Ensure PostgreSQL is running
- Check connection details in `application.properties`
- Verify database exists: `psql -U postgres -l`

### Error: "No tables in database"
- Delete the `target/` directory
- Run `mvn clean install` again
- Hibernate will auto-create tables on startup

### Error: "Port 8080 already in use"
- Change port in `application.properties`:
  ```properties
  server.port=8081
  ```

## Frontend Integration

The frontend is already configured to communicate with these endpoints:
- API Base URL: `http://localhost:8080/api`
- Configured in: `src/utils/api.js`

Frontend features that now work:
- ✅ Doctor search by specialty
- ✅ Doctor search by location (city)
- ✅ Doctor filtering by hospital
- ✅ Doctor booking with hospital information
- ✅ Hospital listings

## Next Steps

1. **Run the backend** following the setup instructions above
2. **Verify** the API endpoints work using Postman or curl
3. **Test** the frontend doctor search functionality
4. **Add** more hospitals and doctors as needed through the API or database directly
5. **Customize** the sample data by editing the `initializeHospitalData()` method in `ApiController.java`

## Files Modified/Created

**Created:**
- `Hospital.java`
- `HospitalRepository.java`
- `HospitalDTO.java`
- `DoctorDTO.java`
- `DoctorSearchRequest.java`
- `HospitalController.java`

**Modified:**
- `Doctor.java` - Added hospital reference and additional fields
- `DoctorRepository.java` - Added search methods
- `ApiController.java` - Added hospital/doctor endpoints and sample data initialization
