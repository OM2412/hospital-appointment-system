#!/bin/bash
# Render build script for backend

set -e

echo "🔨 Building Hospital Backend for Render..."

# Navigate to backend directory
cd backend

# Clean and package
echo "📦 Running Maven build..."
mvn clean package -DskipTests -X

echo "✅ Backend build complete!"
echo "Output: backend/target/hospital-backend-0.0.1-SNAPSHOT.war"
