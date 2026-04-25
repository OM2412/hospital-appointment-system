#!/bin/bash
# ============================================
# Generate Secure Secrets for Deployment
# ============================================
# Run this script to generate strong secrets

echo ""
echo "===== Secure Secret Generation ====="
echo ""

# Generate JWT Secret (43 characters, base64)
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate Database Password (20+ characters)
DB_PASSWORD=$(openssl rand -base64 20)
echo "POSTGRES_PASSWORD=$DB_PASSWORD"
echo ""

# Generate API Key 
API_KEY=$(openssl rand -hex 32)
echo "API_KEY_SECRET=$API_KEY"
echo ""

echo "===== Copy above to Render Dashboard ====="
