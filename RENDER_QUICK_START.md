# 🚀 Render.com Deployment Checklist

## Quick Start

Follow these steps to deploy your Hospital Appointment System on Render.com

---

## ✅ Pre-Deployment Checklist

- [ ] GitHub repository created and all code pushed
- [ ] All changes committed: `git add . && git commit -m "Ready for Render"` && `git push`
- [ ] Backend builds locally: `cd backend && mvn clean package -DskipTests`
- [ ] Frontend builds locally: `npm install && npm run build`
- [ ] No hardcoded API URLs (using environment variables)

---

## 📋 Deployment Steps (15-20 minutes)

### 1️⃣ Create Render Account
```
1. Go to render.com
2. Sign up with GitHub
3. Connect your repository
```

### 2️⃣ Create PostgreSQL Database
```
Service Type: PostgreSQL
Name: hospital-db
Plan: Standard
Region: us-east-1 (or your preference)
```

**After creation, save:**
- Internal Connection String: `postgresql://...@hospital-db.render.internal:5432/hospital_db`
- Username: `postgres`
- Password: (auto-generated, copy it)

### 3️⃣ Deploy Backend
```
Service Type: Web Service
Name: hospital-backend
Runtime: Java
Region: Same as database

Build Command:
  cd backend && mvn clean package -DskipTests

Start Command:
  java -jar backend/target/hospital-backend-0.0.1-SNAPSHOT.war

Environment Variables:
  SPRING_DATASOURCE_URL=jdbc:postgresql://hospital-db.render.internal:5432/hospital_db
  SPRING_DATASOURCE_USERNAME=postgres
  SPRING_DATASOURCE_PASSWORD=[paste DB password]
  JWT_SECRET=[generate random: openssl rand -base64 32]
  SPRING_JPA_HIBERNATE_DDL_AUTO=update
  SERVER_PORT=8080
  ALLOWED_ORIGINS=https://hospital-frontend-xxx.onrender.com
  LOGGING_LEVEL_ROOT=INFO
```

**Wait for deployment** ⏳ (5-10 minutes)

**Copy Backend URL:** `https://hospital-backend-xxx.onrender.com`

### 4️⃣ Deploy Frontend
```
Service Type: Web Service
Name: hospital-frontend
Runtime: Node
Region: Same as backend

Build Command:
  npm install && npm run build

Start Command:
  npm run preview -- --host 0.0.0.0

Environment Variables:
  VITE_API_URL=https://hospital-backend-xxx.onrender.com/api
  NODE_ENV=production
```

**Wait for deployment** ⏳ (3-5 minutes)

**Copy Frontend URL:** `https://hospital-frontend-xxx.onrender.com`

### 5️⃣ Update Backend CORS
```
1. Go to hospital-backend service
2. Click "Environment"
3. Update ALLOWED_ORIGINS to:
   https://hospital-frontend-xxx.onrender.com
4. Save (auto-redeploy)
```

---

## 🧪 Test Your Deployment

### Frontend Access
```
https://hospital-frontend-xxx.onrender.com
```

### Backend API Test
```bash
# Using curl (Windows PowerShell)
$url = "https://hospital-backend-xxx.onrender.com/api/health"
(Invoke-WebRequest -Uri $url).StatusCode

# Or in browser console
fetch('https://hospital-backend-xxx.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Functional Test
1. Open frontend in browser
2. Register new account
3. Login
4. Book appointment
5. Check browser console (F12) for successful API calls

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails "mvn not found"** | Ensure Java runtime is selected (not Node) |
| **Frontend can't connect to API** | Check `VITE_API_URL` variable in frontend service |
| **CORS errors in browser** | Update backend `ALLOWED_ORIGINS` with frontend URL |
| **Service keeps restarting** | Check logs tab in Render dashboard for errors |
| **Database connection failed** | Verify `.render.internal` in connection string (not public URL) |
| **Port 8080 already in use** | Render manages ports automatically, likely a config issue |

---

## 📊 Monitoring

### Check Logs
```
Dashboard → Service → Logs → View live logs
```

### Browser Console
```
Press F12 → Console → Check for errors
```

### Backend Health Check
```
https://hospital-backend-xxx.onrender.com/api/health
```

---

## 💾 Database Backup

Render provides automatic daily backups. To manually backup:

```bash
# Using pg_dump (if you have PostgreSQL tools locally)
pg_dump postgresql://postgres:[pass]@hospital-db.render.internal:5432/hospital_db > backup.sql
```

---

## 🔐 Security Notes

⚠️ **Important:**
- [ ] JWT_SECRET is strong (use `openssl rand -base64 32`)
- [ ] Database password is strong (20+ characters)
- [ ] Never commit `.env` files
- [ ] Keep credentials in Render dashboard (not in code)
- [ ] Use HTTPS URLs (Render provides automatic SSL)

---

## 💰 Cost Estimation

| Service | Free Tier | Standard |
|---------|-----------|----------|
| PostgreSQL Database | Limited (sleeps) | ~$7/month |
| Web Service | Free (sleeps) | ~$7/month |
| **Total** | **Free** | **~$21/month** |

---

## 🎉 Success Indicators

✅ Frontend loads at `https://hospital-frontend-xxx.onrender.com`
✅ Can register/login without errors
✅ Can book appointments
✅ Browser console shows no CORS errors
✅ Backend API responds to requests
✅ Data persists in database

---

## Next Steps After Deployment

1. **Custom Domain** → Add your domain in Render settings
2. **Auto-Deploy** → Render auto-deploys on GitHub push
3. **Monitoring** → Set up alerts for service restarts
4. **Performance** → Monitor logs for slow queries
5. **Backups** → Test database restore procedure

---

For detailed step-by-step instructions, see `RENDER_DEPLOYMENT_STEPS.md`
