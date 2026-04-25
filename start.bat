@echo off
echo Starting MasalaMatch Backend...
start cmd /k "cd backend && node server.js"

echo Starting MasalaMatch Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in new windows!
pause
