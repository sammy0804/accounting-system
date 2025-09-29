@echo off
cd /d %~dp0
start cmd /k "docker compose up"
timeout /t 10
start cmd /k "npm run api"
start cmd /k "npm run dev"
echo La aplicación se está iniciando. Puedes cerrar esta ventana.
pause
