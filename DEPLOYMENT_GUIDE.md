# Hospital Appointment System - Deployment Guide

## Project Overview

A full-stack web application for hospital appointment management built with:
- **Frontend**: React 18 + Vite (port 3000)
- **Backend**: Spring Boot 3.5.13 with Java 25 LTS (port 8080)
- **Database**: PostgreSQL 16
- **Authentication**: JWT with Spring Security
- **Containerization**: Docker & Docker Compose

**Status**: ✅ Ready for Production

---

## Phase 1: Local Development Setup

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ and npm
- Maven 4.0+ (if building outside Docker)
- Java 25 JDK (if running locally without Docker)
- PostgreSQL 16 (if running without Docker)

### Quick Start with Docker Compose

```bash
# Clone/navigate to project directory
cd hospital-appointment-system

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Database: localhost:5432 (user: postgres, pass: postgres)
```

### Manual Local Development (without Docker)

1. **Start PostgreSQL Database**:
   ```bash
   # Linux/Mac
   brew services start postgresql
   createdb hospital_db
   
   # Windows (if installed)
   pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
   ```

2. **Build and Run Backend**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   # API available at: http://localhost:8080/api
   
   # Or run the compiled JAR directly (after mvn package)
   java -jar target/hospital-backend-0.0.1-SNAPSHOT.war
   ```

3. **Build and Run Frontend**:
   ```bash
   npm install
   npm run dev
   # Frontend available at: http://localhost:3000
   ```

---

## Phase 2: Production Deployment

### Option A: Cloud Deployment (Recommended)

#### 1. **Render.com** (Easiest for Beginners)

```bash
# 1. Create .env.production file from template
cp .env.production.example .env.production

# 2. Update with your production values
# IMPORTANT: Change JWT_SECRET, database credentials, etc.

# 3. Push to GitHub
git add .
git commit -m "Production deployment"
git push

# 4. In Render Dashboard:
# - Create PostgreSQL database service
# - Create Web Service from GitHub
# - Set Environment Variables from .env.production
# - Deploy
```

**Render Configuration**:
- Build Command: `cd backend && mvn clean package -DskipTests`
- Start Command: `java -jar backend/target/hospital-backend-0.0.1-SNAPSHOT.war`

#### 2. **Railway.app** or **Heroku**

Similar approach - push to Git, connect service provider, set env vars, deploy.

#### 3. **AWS / Google Cloud / Azure**

Use Elastic Container Service (ECS), Cloud Run, or App Service:
1. Build Docker image: `docker build -t hospital-app .`
2. Push to container registry (ECR, GCR, ACR)
3. Deploy from registry
4. Configure managed PostgreSQL database
5. Set environment variables in cloud console

### Option B: Self-Hosted Docker Deployment

```bash
# 1. Build Docker image
docker build -t hospital-app:v1 .

# 2. Push to Docker Hub (optional)
docker login
docker tag hospital-app:v1 yourusername/hospital-app:v1
docker push yourusername/hospital-app:v1

# 3. On production server, create docker-compose.prod.yml
# (update environment variables, database URLs, etc.)

# 4. Run on production server
docker-compose -f docker-compose.prod.yml up -d

# 5. Set up SSL/TLS (nginx reverse proxy or Let's Encrypt)
# 6. Configure domain DNS
```

---

## Environment Variables for Production

**CRITICAL**: Before deploying, create `.env.production` with:

```bash
# Database (use managed PostgreSQL from cloud provider)
SPRING_DATASOURCE_URL=jdbc:postgresql://your-prod-db-host:5432/hospital_db
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=STRONG_PASSWORD_HERE

# JWT Secret (generate with: openssl rand -base64 64)
JWT_SECRET=your_generated_random_secret_at_least_64_chars

# Server
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=validate  # IMPORTANT: Not "update" or "create"

# CORS - update for your domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Phase 3: Post-Deployment Verification

### API Endpoints to Test

1. **Health Check**:
   ```bash
   curl http://localhost:8080/api/hello
   # Expected: "Hello from backend API!"
   ```

2. **Register User**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

3. **Login**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   # Returns JWT token
   ```

4. **Get Doctors** (with token):
   ```bash
   curl http://localhost:8080/api/doctors \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Frontend Pages to Verify

- [ ] Home page loads at `/`
- [ ] Login page works at `/login`
- [ ] Registration works at `/register`
- [ ] Patient Dashboard loads at `/patient-dashboard`
- [ ] Doctor Dashboard loads at `/doctor-dashboard`
- [ ] Admin Dashboard loads at `/admin-dashboard`
- [ ] CORS requests succeed between frontend and backend

---

## Architecture & Security

### Security Considerations

1. **JWT Tokens**: Implement token refresh mechanism
2. **HTTPS**: Use SSL/TLS certificates (Let's Encrypt for free)
3. **Database**: Enable SSL connections, regular backups
4. **API Rate Limiting**: Implement with Spring Security or nginx
5. **Input Validation**: Already implemented with Jakarta Validation annotations
6. **CORS**: Configured for frontend domain only

### Database Schema

The application auto-creates tables via Hibernate JPA:
- `patients` - Patient records
- `doctors` - Doctor profiles with specialties
- `appointments` - Appointment bookings linking patients and doctors

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Connection refused` on port 8080 | Backend not running, check logs: `docker logs hospital_backend` |
| `CORS error` from frontend | Update `ALLOWED_ORIGINS` in SecurityConfig with frontend URL |
| `Database connection failed` | Verify PostgreSQL running, credentials correct, network connectivity |
| `JWT authentication fails` | Ensure `JWT_SECRET` env var is set and consistent |
| `Port already in use` | Kill existing process: `lsof -ti:8080 \| xargs kill -9` (Linux/Mac) |

### View Logs

```bash
# Docker containers
docker logs hospital_backend -f
docker logs hospital_postgres -f

# Or with docker-compose
docker-compose logs -f backend
docker-compose logs -f postgres
```

---

## Maintenance & Scaling

### Database Backups

```bash
# Create backup
docker exec hospital_postgres pg_dump -U postgres hospital_db > backup.sql

# Restore from backup
docker exec -i hospital_postgres psql -U postgres hospital_db < backup.sql
```

### Update Application

```bash
# Build new version
docker build -t hospital-app:v2 .

# Stop and update
docker-compose down
docker pull hospital-app:v2
docker-compose up -d
```

### Monitor Performance

- Use cloud provider's monitoring dashboard
- Set up alerts for CPU, memory, database connections
- Monitor application logs for errors

---

## Next Steps

1. ✅ **Database Setup**: PostgreSQL configured and connected
2. ✅ **JWT Authentication**: User authentication and authorization implemented
3. ✅ **API Endpoints**: Full CRUD operations for doctors, patients, appointments
4. ✅ **Frontend Integration**: React frontend integrated with backend API
5. ⏳ **Production Deployment**: Choose cloud provider and deploy
6. ⏳ **SSL/TLS**: Configure HTTPS on production domain
7. ⏳ **Monitoring**: Set up logging, monitoring, and alerting
8. ⏳ **Advanced Features**: 
   - Email notifications for appointments
   - SMS reminders
   - Payment processing
   - Admin analytics dashboard

---

## Support & Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **Docker Docs**: https://docs.docker.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **JWT Guide**: https://jwt.io/introduction

---

**Last Updated**: 2024-04-16  
**Status**: Ready for Production Deployment  
**Version**: 1.0.0
