@echo off
cd backend
echo Starting Backend...
call mvn spring-boot:run > backend.log 2>&1
