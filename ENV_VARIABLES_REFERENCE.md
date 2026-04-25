# Environment Variables - Names & Values

## 🔐 Database Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `POSTGRES_DB` | `hospital_db` | String | Database name |
| `POSTGRES_USER` | `postgres` | String | Database user |
| `POSTGRES_PASSWORD` | `SecureDB@2024#Hospital` | Secret | Database password (20+ chars) |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://hospital-db:5432/hospital_db` | String | Database connection URL |

---

## 🔑 Security Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `JWT_SECRET` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9abc123xyz` | Secret | JWT signing key (generated) |
| `JWT_EXPIRATION` | `86400000` | Number | Token expiration (24 hours in ms) |

---

## 🌐 API & CORS Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `ALLOWED_ORIGINS` | `https://hospital-frontend.onrender.com,http://localhost:3000` | String | CORS allowed origins |
| `SERVER_PORT` | `8080` | Number | Server port |
| `API_KEY_SECRET` | `api_key_hospital_system_2024` | Secret | API key for external services |

---

## 💾 Hibernate/JPA Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | String | Schema auto-update (update/validate) |
| `SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE` | `5` | Number | DB connection pool size |

---

## 📝 Logging Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `LOGGING_LEVEL_ROOT` | `INFO` | String | Root logging level |
| `LOGGING_LEVEL_COM_EXAMPLE` | `DEBUG` | String | App-specific logging level |

---

## 🖥️ Frontend Variables

| Variable Name | Value | Type | Description |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | String | Local dev API URL |
| `VITE_API_BASE_HOST` | `hospital-backend.onrender.com` | String | Production API host |
| `NODE_ENV` | `production` | String | Environment type |

---

## 📋 Copy to Render Dashboard

**For Backend Service:**
```
POSTGRES_DB=hospital_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SecureDB@2024#Hospital
SPRING_DATASOURCE_URL=jdbc:postgresql://hospital-db:5432/hospital_db
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9abc123xyz
JWT_EXPIRATION=86400000
ALLOWED_ORIGINS=https://hospital-frontend.onrender.com,http://localhost:3000
SERVER_PORT=8080
API_KEY_SECRET=api_key_hospital_system_2024
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE=5
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_EXAMPLE=DEBUG
```

**For Frontend Service:**
```
NODE_ENV=production
VITE_API_BASE_HOST=hospital-backend.onrender.com
VITE_API_URL=https://hospital-backend.onrender.com/api
```

---

## 🔒 Security Notes

- Replace `JWT_SECRET` with: `openssl rand -base64 32`
- Replace `POSTGRES_PASSWORD` with your own strong password
- Replace `hospital-backend.onrender.com` with your actual backend URL
- Never commit these values to git
