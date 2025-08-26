@echo off
echo Starting Customer Chat App...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
echo.

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000 (or auto-detected port)
echo.

echo Press any key to exit...
pause >nul
