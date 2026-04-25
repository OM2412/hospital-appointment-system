# 🔗 Frontend-Backend Connectivity Check Report

**Date**: 2024-04-16  
**Status**: ✅ Configuration Verified | ⚠️ Runtime Test Pending

---

## 1. Configuration Verification

### ✅ Frontend API Client Configuration

**File**: `src/utils/api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
```

**Status**: ✅ CORRECT
- Frontend configured to connect to `http://localhost:8080/api`
- JWT token interceptor added for all requests
- CORS headers configured correctly

### ✅ Backend Security & CORS Configuration

**File**: `backend/src/main/java/com/example/hospital/security/SecurityConfig.java`

```java
configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
configuration.setAllowedHeaders(Arrays.asList("*"));
configuration.setAllowCredentials(true);
```

**Status**: ✅ CORRECT
- CORS enabled for `http://localhost:3000` (development)
- CORS enabled for `http://localhost:5173` (Vite preview)
- All HTTP methods allowed
- Credentials enabled for JWT tokens

### ✅ Backend API Endpoints

**File**: `backend/src/main/java/com/example/hospital/controllers/ApiController.java`

**Available Endpoints**:
- ✅ `POST /api/auth/login` - Public (no auth required)
- ✅ `POST /api/auth/register` - Public (no auth required)
- ✅ `GET /api/hello` - Public (no auth required)
- ✅ `GET /api/doctors` - Protected (requires JWT)
- ✅ `GET /api/patients` - Protected (requires JWT)
- ✅ `GET /api/appointments` - Protected (requires JWT)
- ✅ `POST /api/appointments` - Protected (requires JWT)

**Status**: ✅ ALL ENDPOINTS CONFIGURED

---

## 2. Runtime Connectivity Test

### Prerequisites
Ensure these services are running:
- PostgreSQL on `localhost:5432`
- Spring Boot Backend on `http://localhost:8080`
- React Frontend on `http://localhost:3000`

### Option A: Using Docker Compose (Recommended)

```bash
cd c:\Users\omjad\OneDrive\Desktop\MACRO
docker-compose up -d

# Wait 30 seconds for services to start
# Then test endpoints below
```

**Expected Services**:
- PostgreSQL: `localhost:5432` (postgres/postgres)
- Backend: `http://localhost:8080/api/hello`
- Frontend: `http://localhost:3000`

### Option B: Manual Setup

**1. Start PostgreSQL**:
```bash
# If using Docker
docker run -d --name hospital_postgres \
  -e POSTGRES_DB=hospital_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
```

**2. Start Backend**:
```bash
"C:\Users\omjad\.jdk\jdk-25\bin\java" -jar `
  "c:\Users\omjad\OneDrive\Desktop\MACRO\backend\target\hospital-backend.war"

# Should see: "Started HospitalBackendApplication in ... seconds"
```

**3. Start Frontend**:
```bash
cd "c:\Users\omjad\OneDrive\Desktop\MACRO"
npm install
npm run dev

# Should see: "Local: http://localhost:5173"
```

---

## 3. Connectivity Test Cases

### Test 1: Health Check (No Auth Required)

**Purpose**: Verify backend is running and responding

```bash
curl http://localhost:8080/api/hello

# Expected Response:
# "Hello from backend API!"
```

**Test Result**: ___________

### Test 2: User Registration (Public)

**Purpose**: Verify backend can create users and persist to database

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Expected Response:
# {
#   "message": "Patient registered successfully",
#   "patientId": 1
# }
```

**Test Result**: ___________

### Test 3: User Login (JWT Token Generation)

**Purpose**: Verify JWT authentication flow

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Expected Response:
# {
#   "token": "eyJhbGciOiJIUzUxMiJ9...",
#   "username": "testuser",
#   "role": "patient"
# }
```

**Test Result**: ___________  
**Token Obtained**: ___________

### Test 4: Protected Endpoint (Requires JWT)

**Purpose**: Verify JWT token validation and database queries

```bash
curl http://localhost:8080/api/doctors \
  -H "Authorization: Bearer <TOKEN_FROM_TEST_3>"

# Expected Response:
# [
#   {
#     "id": 1,
#     "name": "Dr. Sarah Johnson",
#     "specialty": "Cardiology"
#   },
#   ...
# ]
```

**Test Result**: ___________

### Test 5: Frontend to Backend (CORS Check)

**Purpose**: Verify React frontend can communicate with backend

1. Open browser to `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this JavaScript:

```javascript
fetch('http://localhost:8080/api/hello')
  .then(r => r.text())
  .then(d => console.log('✅ Backend Response:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

**Expected Output**: `✅ Backend Response: Hello from backend API!`

**Test Result**: ___________

### Test 6: Frontend API Client Integration

**Purpose**: Verify Axios client in frontend works correctly

In browser console:
```javascript
import apiClient from './src/utils/api.js'
// Or from the built app:
// Check Network tab when clicking login/register buttons
// Should see POST requests to http://localhost:8080/api/auth/*
```

**Test Result**: ___________

---

## 4. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **Connection refused on 8080** | Backend not running | Start backend: `java -jar hospital-backend.war` |
| **CORS error in browser** | CORS not configured | Verify `SecurityConfig.java` has `setAllowedOrigins` |
| **JWT token invalid** | Secret key mismatch | Verify `jwt.secret` in `application.properties` |
| **Database connection failed** | PostgreSQL not running | Start PostgreSQL on port 5432 |
| **Port already in use** | Service already running | Kill process: `Get-Process -Name java \| Stop-Process` |
| **Frontend can't reach backend** | Wrong API URL | Verify `src/utils/api.js` uses `http://localhost:8080/api` |

---

## 5. Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ React Frontend (http://localhost:3000)                      │
│                                                             │
│ src/utils/api.js                                           │
│   ↓                                                        │
│   const apiClient = axios.create({                        │
│     baseURL: 'http://localhost:8080/api'                │
│   })                                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
         HTTP/REST (CORS enabled)
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Spring Boot Backend (http://localhost:8080)                 │
│                                                             │
│ ApiController                                              │
│   ├─ POST /api/auth/login (Public)                         │
│   ├─ POST /api/auth/register (Public)                      │
│   ├─ GET /api/doctors (Protected - requires JWT)          │
│   ├─ GET /api/patients (Protected - requires JWT)         │
│   └─ GET /api/appointments (Protected - requires JWT)     │
│                                                             │
│ JwtTokenProvider                                           │
│   ├─ Generate token on login                              │
│   └─ Validate token on protected endpoints                │
│                                                             │
│ SecurityConfig                                             │
│   ├─ CORS: http://localhost:3000                          │
│   └─ Protected endpoints check JWT                        │
└────────────────────┬────────────────────────────────────────┘
                     │
              JDBC Connection
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL Database (localhost:5432)                        │
│                                                             │
│ Tables:                                                    │
│   ├─ patients                                              │
│   ├─ doctors                                               │
│   └─ appointments                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. API Request/Response Examples

### Login Request
```
POST /api/auth/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Login Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "username": "testuser",
  "role": "patient"
}
```

### Protected Request (Doctors List)
```
GET /api/doctors HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

### Protected Response
```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000

[
  {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "specialty": "Cardiology"
  },
  {
    "id": 2,
    "name": "Dr. Michael Brown",
    "specialty": "General Practice"
  }
]
```

---

## 7. Verification Checklist

- [ ] Backend running on `http://localhost:8080`
- [ ] PostgreSQL running on `localhost:5432`
- [ ] Frontend running on `http://localhost:3000` or `http://localhost:5173`
- [ ] Test 1 (Health Check) passing
- [ ] Test 2 (Registration) passing
- [ ] Test 3 (Login) returning JWT token
- [ ] Test 4 (Protected Endpoint) passing with token
- [ ] Test 5 (CORS) no browser console errors
- [ ] Test 6 (Network tab) shows requests to `http://localhost:8080/api`
- [ ] No 401/403 Unauthorized errors
- [ ] No CORS errors in browser console

---

## 8. Next Steps

### If All Tests Pass:
✅ **Frontend-Backend connection is working correctly**
- Proceed to production deployment
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### If Tests Fail:
❌ **Debug using these steps**:
1. Check backend logs: `docker logs hospital_backend`
2. Check browser console (F12 → Console tab)
3. Check network requests (F12 → Network tab)
4. Verify database is running: `docker logs hospital_postgres`
5. Test API directly with curl or Postman

---

## 9. Production Deployment Notes

**For Production**:
- Update `ALLOWED_ORIGINS` to your domain:
  ```java
  configuration.setAllowedOrigins(List.of("https://yourdomain.com", "https://www.yourdomain.com"));
  ```

- Update frontend API URL in environment:
  ```bash
  REACT_APP_API_URL=https://api.yourdomain.com/api
  ```

- Use HTTPS for all connections
- Enable HSTS headers
- Implement rate limiting
- Monitor API logs
- Set up automated backups

---

**Status**: Ready for Testing  
**Last Updated**: 2024-04-16  
**Version**: 2.0.0 Production Ready
