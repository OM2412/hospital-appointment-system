@echo off
echo Starting Hospital Appointment System (Full Stack + AI)...

echo Starting Frontend (React) in a new window...
start "Frontend" cmd /c "npm install && npm run dev -- --host"

echo Starting Backend (Spring Boot) in a new window...
start "Backend" cmd /c "cd backend && run_backend.bat"

echo Starting AI/ML Service (Python) in a new window...
start "AI-Service" cmd /c "cd ml_service && pip install -r requirements.txt && python main.py"

echo Starting Email Service (Node.js) in a new window...
start "Email-Service" cmd /c "cd email-service && npm install && npm start"

echo.
echo All four services (Frontend, Backend, AI, and Email) are starting in separate windows!
echo Please ensure PostgreSQL is running at localhost:5432 with database 'hospital_db'.
echo.
pause
