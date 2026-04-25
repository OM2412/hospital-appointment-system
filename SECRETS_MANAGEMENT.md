# Secure Secrets Management Guide

## 🔐 How to Generate & Store Secrets

### **Method 1: Using PowerShell (Windows)**

```powershell
# Generate JWT Secret (43 chars, highly random)
$jwtSecret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (Get-Random)))
Write-Host "JWT_SECRET=$jwtSecret"

# Generate Database Password
$dbPassword = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (Get-Random)))
Write-Host "POSTGRES_PASSWORD=$dbPassword"

# Generate API Key
$apiKey = (New-Guid).ToString() + '_' + (New-Guid).ToString()
Write-Host "API_KEY_SECRET=$apiKey"
```

### **Method 2: Using OpenSSL (Mac/Linux)**

```bash
# Generate JWT Secret (32 bytes = 256 bits)
openssl rand -base64 32

# Generate strong database password (20 bytes)
openssl rand -base64 20

# Generate API key (32 hex bytes)
openssl rand -hex 32
```

### **Method 3: Using Scripts**

**Windows:**
```bash
cd c:\Users\omjad\OneDrive\Desktop\MACRO
.\generate-secrets.bat
```

**Mac/Linux:**
```bash
cd /path/to/MACRO
bash generate-secrets.sh
```

---

## 📋 All Required Secrets

| Secret | Length | Example | Where to Use |
|---|---|---|---|
| `JWT_SECRET` | 43+ chars | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9abc...` | Render Backend Env |
| `POSTGRES_PASSWORD` | 20+ chars | `SecureDB@2024#Hospital` | Render DB + Backend |
| `API_KEY_SECRET` | 32+ chars | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | Render Backend Env |
| `JWT_EXPIRATION` | 10 digits | `86400000` | Fixed value (24 hours) |

---

## 🔒 Security Best Practices

### ✅ DO:
- Generate unique secrets for each environment (dev, staging, prod)
- Use cryptographically random values (openssl, Python secrets, etc.)
- Store secrets ONLY in environment variables
- Rotate secrets periodically (quarterly minimum)
- Never commit secrets to git
- Use different secrets for different services

### ❌ DON'T:
- Hardcode secrets in code
- Commit `.env.local` or `.env.production` to git
- Use simple/predictable passwords like `password123`
- Reuse secrets across environments
- Share secrets via email or chat
- Log secrets in console/logs

---

## 🚀 Setting Secrets in Render

1. **Go to Render Dashboard** → Your Web Service
2. **Click "Environment"**
3. **Add each secret:**
   ```
   JWT_SECRET=<generated-value>
   POSTGRES_PASSWORD=<generated-value>
   API_KEY_SECRET=<generated-value>
   SPRING_DATASOURCE_URL=jdbc:postgresql://hospital-db:5432/hospital_db
   ALLOWED_ORIGINS=https://hospital-frontend.onrender.com
   LOGGING_LEVEL_ROOT=INFO
   ```
4. **Click "Save"** → Auto-redeploys with new secrets

---

## 🔄 Rotating Secrets (After Deployment)

### Step 1: Generate New Secrets
```bash
openssl rand -base64 32  # New JWT secret
openssl rand -base64 20  # New DB password
```

### Step 2: Update Render Dashboard
- Go to Environment variables
- Update `JWT_SECRET` and `POSTGRES_PASSWORD`
- Click Save

### Step 3: Redeploy
- Render auto-redeploys with new secrets
- Monitor logs for errors

### Step 4: Update Database (if needed)
```bash
# In Render PostgreSQL dashboard:
ALTER USER postgres WITH PASSWORD 'new-password';
```

---

## 🛡️ Secret Leakage Prevention

### In Code:
```javascript
// ❌ WRONG
const jwtSecret = "my-secret-key-123"

// ✅ CORRECT
const jwtSecret = process.env.JWT_SECRET
```

### In Git:
```bash
# .gitignore (ensure these exist)
.env
.env.local
.env.*.local
```

### In Logs:
```java
// ❌ WRONG
logger.info("JWT Secret: " + jwtSecret)

// ✅ CORRECT
logger.info("JWT configured")  // Don't log the secret!
```

---

## 📊 Secrets Checklist

- [ ] Generated JWT_SECRET with `openssl rand -base64 32`
- [ ] Generated POSTGRES_PASSWORD with `openssl rand -base64 20`
- [ ] Generated API_KEY_SECRET
- [ ] Added secrets to Render Dashboard Environment
- [ ] Verified `.gitignore` excludes `.env*` files
- [ ] No secrets hardcoded in source code
- [ ] Code reads from `process.env` / `import.meta.env`
- [ ] Local `.env.local` not committed
- [ ] Ready to deploy!

---

## 🔗 Reference Commands

```bash
# Linux/Mac
openssl rand -base64 32    # 32-byte secret, base64 encoded
openssl rand -base64 20    # 20-byte password
openssl rand -hex 32       # 32 hex characters

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Python
import secrets
secrets.token_urlsafe(32)
secrets.token_hex(16)

# Node.js
require('crypto').randomBytes(32).toString('base64')
require('crypto').randomBytes(20).toString('hex')
```

---

## ⚠️ If Secret is Compromised

**Immediate Actions:**
1. Generate new secrets
2. Update Render environment variables
3. Monitor logs for suspicious activity
4. Rotate database password
5. Review API access logs
6. Consider JWT blacklisting (optional)

**Prevent Future Issues:**
- Use secret rotation every 90 days
- Use separate secrets per environment
- Monitor secret usage in logs
- Implement audit trails

---

**Never share secrets! Keep them secure! 🔐**
