# Render.com Deployment - Environment Variables Setup

**⚠️ CRITICAL**: PostgreSQL JDBC URLs MUST include `jdbc:postgresql://` prefix, not just `postgresql://`

This document contains all environment variables needed for Render.com deployment. 
**IMPORTANT**: Never commit secrets to git. Use Render's dashboard to add these.

## Database Service (PostgreSQL)

**Service Name**: `hospital-db`  
**Type**: PostgreSQL (Create via Render Dashboard)

### Environment Variables
```
POSTGRES_DB=hospital_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=[Generate strong password - 20+ characters]
```

---

## Backend Service (Spring Boot)

**Service Name**: `hospital-backend`  
**Type**: Web Service  
**GitHub**: Your repository  
**Runtime**: Java  
**Build Command**: `cd backend && mvn clean package -DskipTests`  
**Start Command**: `java -jar backend/target/hospital-backend-0.0.1-SNAPSHOT.war`

### Environment Variables

```
# Database Connection (JDBC URL must start with jdbc:postgresql://)
SPRING_DATASOURCE_URL=jdbc:postgresql://hospital-db:5432/hospital_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=[SAME as DB password above]

# JWT Security
JWT_SECRET=[Generate: openssl rand -base64 32]

# Hibernate Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE=5

# CORS Configuration
ALLOWED_ORIGINS=https://hospital-frontend-xxx.onrender.com,http://localhost:3000

# Logging
LOGGING_LEVEL_ROOT=INFO
```

---

## Frontend Service (React + Vite)

**Service Name**: `hospital-frontend`  
**Type**: Web Service  
**GitHub**: Your repository  
**Runtime**: Node  
**Build Command**: `npm install && npm run build`  
**Start Command**: `npm run preview -- --host 0.0.0.0`

### Environment Variables

```
NODE_ENV=production
VITE_API_BASE_HOST=hospital-backend-xxx.onrender.com
```

---

## Step-by-Step Deployment on Render

### 1. Create PostgreSQL Database
```
1. Go to render.com dashboard
2. Click "New +" → "PostgreSQL"
3. Name: hospital-db
4. Select region (same as your web services)
5. Plan: Standard
6. Click "Create Database"
7. Copy connection details
```

### 2. Create Backend Web Service
```
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: hospital-backend
4. Branch: main
5. Runtime: Java
6. Build Command: cd backend && mvn clean package -DskipTests
7. Start Command: java -jar backend/target/hospital-backend-0.0.1-SNAPSHOT.war
8. Plan: Standard
9. Click "Create Web Service"
10. Add Environment Variables (see above)
11. Deploy
```

### 3. Create Frontend Web Service
```
1. Click "New +" → "Web Service"
2. Select same repository
3. Name: hospital-frontend
4. Branch: main
5. Runtime: Node
6. Build Command: npm install && npm run build
7. Start Command: npm run preview -- --host 0.0.0.0
8. Plan: Standard
9. Click "Create Web Service"
10. Add Environment Variables (see above)
11. Deploy
```

### 4. Update CORS Configuration
Once frontend is deployed, update backend:
```
1. Go to hospital-backend service
2. Click "Environment"
3. Update ALLOWED_ORIGINS with your actual frontend URL
4. Click "Save"
5. Service auto-redeploys
```

---

## Security Notes

⚠️ **Critical**: 
- [ ] Never add secrets to render.yaml or git
- [ ] Generate strong passwords and JWT secrets
- [ ] Use Render dashboard for secrets management
- [ ] Database password: 20+ characters (mix of upper, lower, numbers, symbols)
- [ ] JWT_SECRET: `openssl rand -base64 32` (32 bytes, base64 encoded)

---

## Connection URLs

After deployment, services will be available at:

```
Frontend: https://hospital-frontend-xxx.onrender.com
Backend: https://hospital-backend-xxx.onrender.com
Backend API: https://hospital-backend-xxx.onrender.com/api
Database: postgresql://hospital-db.onrender.com:5432/hospital_db
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Build fails - mvn not found | Check Java runtime is selected, not Node |
| Frontend can't connect API | Verify VITE_API_BASE_HOST in frontend environment |
| Database connection refused | Check SPRING_DATASOURCE_URL uses correct hostname |
| CORS errors in browser | Update backend ALLOWED_ORIGINS with frontend URL |
| 502 Bad Gateway | Check service logs in Render dashboard |

---

## Auto-Deployment

Your services will automatically redeploy when you:
```bash
git push origin main
```

Changes are detected automatically by Render's integration with GitHub.
