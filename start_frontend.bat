@echo off
cd frontend
echo Starting Frontend...
call npm run dev > frontend.log 2>&1
