@echo off
REM ============================================
REM Generate Secure Secrets for Deployment
REM ============================================
REM Run this script to generate strong secrets

echo.
echo ===== Secure Secret Generation =====
echo.

REM Generate JWT Secret (32 bytes = 256 bits)
for /f %%A in ('powershell -Command "[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (Get-Random)))"') do set JWT_SECRET=%%A

REM Generate Database Password
for /f %%A in ('powershell -Command "[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString().Replace(\"-\", \"\") + (Get-Random -Minimum 10000 -Maximum 99999)))"') do set DB_PASSWORD=%%A

REM Generate API Key
for /f %%A in ('powershell -Command "(New-Guid).ToString() + '_' + (New-Guid).ToString()"') do set API_KEY=%%A

echo JWT_SECRET=%JWT_SECRET%
echo.
echo POSTGRES_PASSWORD=%DB_PASSWORD%
echo.
echo API_KEY_SECRET=%API_KEY%
echo.
echo ===== Copy above to Render Dashboard =====
pause
