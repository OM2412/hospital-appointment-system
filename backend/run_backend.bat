@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using Java from: %JAVA_HOME%
echo Checking for Maven in root folder...

if exist "..\apache-maven-3.9.15" (
    set "MAVEN_HOME=..\apache-maven-3.9.15"
    goto start_mvn
)

if exist "apache-maven-3.9.15" (
    set "MAVEN_HOME=apache-maven-3.9.15"
    goto start_mvn
)

echo ERROR: Could not find apache-maven-3.9.15 in root or backend folder.
pause
exit /b

:start_mvn
echo Found Maven at %MAVEN_HOME%
echo.
echo Starting Spring Boot Backend...
set "PATH=%CD%\%MAVEN_HOME%\bin;%PATH%"
call mvn spring-boot:run

pause
