# 🐳 Docker Build & Deployment Guide

## ⚠️ Common Error: "failed to read dockerfile: open Dockerfile: no such file or directory"

This error occurs when:
1. Docker build is run from the wrong directory
2. The Dockerfile path isn't specified correctly
3. Build context is incorrect

---

## ✅ Fix: How to Build Correctly

### **Option 1: Build Combined Image (Backend + Frontend)**

```bash
# ========================================
# From project ROOT directory
# ========================================

# Step 1: Verify you're in the correct directory
cd c:\Users\omjad\OneDrive\Desktop\MACRO
dir Dockerfile  # Should show the file exists

# Step 2: Build the image
docker build -f Dockerfile -t hospital-system:latest .

# Step 3: Run the container
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/hospital_db \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e JWT_SECRET=your-secret-here \
  --name hospital-app \
  hospital-system:latest

# Step 4: Check logs
docker logs -f hospital-app
```

---

### **Option 2: Render-Optimized Build**

Use this when deploying to Render.com:

```bash
# Build with Render-specific Dockerfile
docker build -f Dockerfile.render -t hospital-system:render .

# Test locally
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e SPRING_DATASOURCE_URL=postgresql://localhost:5432/hospital_db \
  -e JWT_SECRET=test-secret \
  hospital-system:render
```

---

### **Option 3: Separate Services (Microservices)**

#### Build Backend Only:
```bash
# From project ROOT
docker build -f Dockerfile.backend -t hospital-backend:latest .

docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e SPRING_DATASOURCE_URL=postgresql://localhost:5432/hospital_db \
  --name backend \
  hospital-backend:latest
```

#### Build Frontend Only:
```bash
# From project ROOT
docker build -f Dockerfile.frontend -t hospital-frontend:latest .

docker run -d \
  -p 3000:3000 \
  -e VITE_API_BASE_HOST=localhost:8080 \
  --name frontend \
  hospital-frontend:latest
```

---

## 🐳 Docker Compose (All Services Together)

Create `docker-compose.yml` (if not already done):

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: hospital-db
    environment:
      POSTGRES_DB: hospital_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: hospital-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: postgresql://db:5432/hospital_db
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      JWT_SECRET: ${JWT_SECRET:-dev-secret}
      ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: hospital-frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_HOST: backend:8080
    depends_on:
      - backend

volumes:
  postgres_data:

networks:
  default:
    name: hospital-network
```

### Run with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔍 Troubleshooting

### **Error: "failed to read dockerfile"**
```bash
# ❌ WRONG - Running from wrong directory
cd backend
docker build -f Dockerfile -t app .

# ✅ CORRECT - Run from project ROOT
cd c:\Users\omjad\OneDrive\Desktop\MACRO
docker build -f Dockerfile -t app .
```

### **Error: "COPY failed: file not found"**
```bash
# Ensure you're building from project ROOT where Dockerfile can access:
# - backend/           (for Java source)
# - src/               (for React source)
# - package.json       (for npm)
# - index.html         (for frontend)

ls Dockerfile backend/pom.xml package.json  # All should exist
```

### **Error: "npm ERR!" or Maven dependency failures**
```bash
# Clear Docker cache and rebuild
docker build --no-cache -f Dockerfile -t app .
```

### **Container exits immediately**
```bash
# Check logs
docker logs <container-id>

# Common issues:
# - DATABASE_URL not set → container can't connect to DB
# - PORT conflicts → 8080 already in use
# - Missing environment variables
```

---

## 📊 Available Dockerfiles

| File | Use Case | Services |
|------|----------|----------|
| `Dockerfile` | Development & Production | Backend + Frontend combined |
| `Dockerfile.render` | Render.com deployment | Backend + Frontend with $PORT support |
| `Dockerfile.backend` | Backend only (microservices) | Java backend only |
| `Dockerfile.frontend` | Frontend only (microservices) | React frontend in nginx |

---

## 🚀 Deployment to Render

Render will automatically detect the Dockerfile and build it. Just:

1. Push to GitHub
2. Create Web Service in Render Dashboard
3. Set build command: *(leave empty - auto-detected)*
4. Set start command: *(leave empty - auto-detected)*
5. Add environment variables from `ENV_VARIABLES_REFERENCE.md`
6. Click "Deploy"

---

## 🧪 Testing the Build

```bash
# Step 1: Build
docker build -f Dockerfile -t hospital:test .

# Step 2: Check image size
docker images hospital:test

# Step 3: Run interactively to test
docker run -it \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=postgresql://localhost:5432/hospital_db \
  -e JWT_SECRET=test \
  hospital:test

# Step 4: Test in another terminal
curl http://localhost:8080/health

# Step 5: Stop
Ctrl+C (in docker terminal)
```

---

## ✅ Checklist Before Deployment

- [ ] Dockerfiles are in project ROOT directory
- [ ] `docker build` command runs from project ROOT
- [ ] `-f Dockerfile` flag specifies correct file
- [ ] Build context `.` includes `backend/`, `src/`, `package.json`
- [ ] Environment variables set for database connection
- [ ] Port conflicts resolved (8080 available)
- [ ] Docker daemon running
- [ ] All source files committed to git

---

## 📝 Quick Commands

```bash
# Build
docker build -f Dockerfile -t app:latest .

# Run
docker run -p 8080:8080 app:latest

# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# View logs
docker logs -f <container-id>

# SSH into container
docker exec -it <container-id> sh

# Check container status
docker ps -a
```

---

## 🎯 Key Points

1. **Always run `docker build` from project ROOT** (`c:\Users\omjad\OneDrive\Desktop\MACRO`)
2. **Use `-f Dockerfile` to specify the correct file**
3. **Environment variables are critical** - set them when running
4. **Check Docker daemon is running** - `docker ps` before building
5. **Logs are your friend** - `docker logs -f` to debug issues

You're all set! 🚀
