#!/bin/bash
# Quick Connectivity Test Script
# Run with: bash test-connectivity.sh

echo "🔗 Hospital Appointment System - Connectivity Test"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check (Backend Running?)${NC}"
response=$(curl -s http://localhost:8080/api/hello)
if [[ "$response" == "Hello from backend API!" ]]; then
    echo -e "${GREEN}✅ PASS${NC} - Backend is running"
else
    echo -e "${RED}❌ FAIL${NC} - Backend not responding"
    echo "   Response: $response"
fi
echo ""

# Test 2: Registration
echo -e "${YELLOW}Test 2: User Registration${NC}"
response=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "password": "password123"
  }')

if echo "$response" | grep -q '"patientId"'; then
    echo -e "${GREEN}✅ PASS${NC} - User registration working"
    echo "   Response: $response"
else
    echo -e "${RED}❌ FAIL${NC} - Registration failed"
    echo "   Response: $response"
fi
echo ""

# Test 3: Login
echo -e "${YELLOW}Test 3: User Login (JWT Token)${NC}"
response=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testdoctor",
    "password": "password123"
  }')

if echo "$response" | grep -q '"token"'; then
    echo -e "${GREEN}✅ PASS${NC} - Login successful, JWT token generated"
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ FAIL${NC} - Login failed"
    echo "   Response: $response"
fi
echo ""

# Test 4: Protected Endpoint
if [ -n "$TOKEN" ]; then
    echo -e "${YELLOW}Test 4: Protected Endpoint (Doctors List)${NC}"
    response=$(curl -s http://localhost:8080/api/doctors \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$response" | grep -q '"name"'; then
        echo -e "${GREEN}✅ PASS${NC} - Protected endpoint accessible with JWT"
        echo "   Response: $response"
    else
        echo -e "${RED}❌ FAIL${NC} - Protected endpoint failed"
        echo "   Response: $response"
    fi
else
    echo -e "${RED}⚠️  SKIP${NC} - Test 4 requires valid token from Test 3"
fi
echo ""

# Test 5: Frontend Connection
echo -e "${YELLOW}Test 5: Frontend Available?${NC}"
if curl -s --head http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✅ PASS${NC} - Frontend running on port 3000"
else
    echo -e "${RED}❌ FAIL${NC} - Frontend not running on port 3000"
fi
echo ""

echo "=================================================="
echo -e "Testing completed at $(date)"
