# Render.com Deployment Guide for Hospital Appointment System

## Prerequisites
- GitHub account with your repository pushed
- Render.com account (free tier available)
- Project ready for production

---

## Step 1: Push to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 2: Create Render Account & Connect GitHub

1. Go to [render.com](https://render.com)
2. Sign up and create account
3. Click "New +" → "GitHub" to connect your repository
4. Authorize Render to access your GitHub repos
5. Select your hospital appointment system repository

---

## Step 3: Create PostgreSQL Database Service

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `hospital-db`
   - **Database**: `hospital_db`
   - **User**: `postgres`
   - **Region**: Same as your web services (e.g., `us-east-1`)
   - **Plan**: `Standard` (minimum for production)
3. Click **"Create Database"**
4. **Copy the Internal Connection String** (looks like: `postgresql://...@hospital-db.render.internal:5432/hospital_db`)
5. Save your credentials securely

---

## Step 4: Create Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. **Configure**:
   - **Name**: `hospital-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Java`
   - **Build Command**:
     ```
     cd backend && mvn clean package -DskipTests -X
     ```
   - **Start Command**:
     ```
     java -jar backend/target/hospital-backend-0.0.1-SNAPSHOT.war
     ```
   - **Plan**: `Standard` or higher

4. **Add Environment Variables** (scroll down):
   ```
   SPRING_DATASOURCE_URL = jdbc:postgresql://hospital-db.render.internal:5432/hospital_db
   SPRING_DATASOURCE_USERNAME = postgres
   SPRING_DATASOURCE_PASSWORD = [copy from DB service]
   JWT_SECRET = [generate a strong random string - e.g., openssl rand -base64 32]
   JWT_EXPIRATION = 86400000
   ALLOWED_ORIGINS = https://your-frontend-domain.onrender.com
   SPRING_JPA_HIBERNATE_DDL_AUTO = update
   SERVER_PORT = 8080
   LOGGING_LEVEL_ROOT = INFO
   ```

5. Click **"Create Web Service"**
6. **Wait for deployment** (5-10 minutes)
7. Copy the backend URL (will be: `https://hospital-backend-xxx.onrender.com`)

---

## Step 5: Create Frontend Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository again
3. **Configure**:
   - **Name**: `hospital-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```
     npm install && npm run build
     ```
   - **Start Command**:
     ```
     npm run preview -- --host 0.0.0.0
     ```
   - **Plan**: `Standard`

4. **Add Environment Variables**:
   ```
   VITE_API_URL = https://hospital-backend-xxx.onrender.com/api
   NODE_ENV = production
   ```
   (Replace `hospital-backend-xxx` with your actual backend URL)

5. Click **"Create Web Service"**
6. **Wait for deployment** (3-5 minutes)

---

## Step 6: Update Backend CORS Configuration

Once frontend is deployed, get its URL and update backend environment variable in Render:

1. Go to **hospital-backend** service
2. Click **"Environment"**
3. Update `ALLOWED_ORIGINS` with your frontend URL:
   ```
   https://hospital-frontend-xxx.onrender.com
   ```
4. Save - this will trigger a redeploy

---

## Step 7: Test the Deployment

1. **Frontend**: `https://hospital-frontend-xxx.onrender.com`
2. **Backend API**: `https://hospital-backend-xxx.onrender.com/api`
3. **Test Login**:
   - Register new account or use test credentials
   - Check browser console (F12) for API calls
   - Verify data is stored in PostgreSQL

---

## Important Notes

### Security
- ✅ **Never commit `.env` files** - Use Render's environment variables
- ✅ **JWT_SECRET** needs to be a strong random string
- ✅ **Database password** should be strong (20+ characters)
- ✅ Use Internal Connection String for database (not exposed to internet)

### Database Initialization
- First deployment automatically creates tables via Hibernate DDL
- If adding new tables/columns, use `SPRING_JPA_HIBERNATE_DDL_AUTO=update`
- For production, change to `validate` after schema is stable

### Performance
- Start with **Standard** plan - upgrade if needed
- Render auto-scales within your plan limits
- Set `SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE=5` for optimal DB connections

### Monitoring
- Use Render Dashboard **Logs** tab to check deployment status
- Enable **Browser DevTools** (F12) to debug frontend API calls
- Check backend logs for Spring Boot startup issues

---

## Troubleshooting

### Build Fails with Maven Error
```bash
# Ensure backend/pom.xml has correct Java version
# Add to pom.xml:
<properties>
  <java.version>25</java.version>
</properties>
```

### Frontend Can't Connect to Backend
1. Check `VITE_API_URL` in frontend environment
2. Verify backend `ALLOWED_ORIGINS` includes frontend URL
3. Check browser console (F12) for CORS errors

### Database Connection Failed
1. Verify `SPRING_DATASOURCE_URL` uses `.render.internal` domain
2. Check database credentials match exactly
3. Ensure backend and database are in same region

### Port Issues
- Backend must listen on `8080` (Render requirement)
- Frontend must listen on `0.0.0.0:3000` or use `--host 0.0.0.0`

---

## Cost Estimation (Free Tier Available)

- **PostgreSQL Database**: ~$7/month (or free tier with limited resources)
- **Backend Web Service**: ~$7/month per instance
- **Frontend Web Service**: ~$7/month per instance
- **Free tier**: Limited CPU/RAM, sleeps after inactivity

Total: ~$21/month for basic production setup

---

## Next Steps

After successful deployment:
1. Set up custom domain (Render supports custom domains)
2. Enable auto-deploy on GitHub push
3. Set up monitoring and alerting
4. Regular database backups
5. Performance optimization based on usage
