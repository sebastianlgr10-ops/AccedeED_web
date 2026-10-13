@echo off
title AccedeED Web - Servidor Local
echo ==================================================
echo   Iniciando AccedeED Web Edition...
echo ==================================================
cd /d "%~dp0"
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Python no pudo iniciar el servidor automaticamente.
    echo Abriendo index.html directamente en tu navegador...
    start "" index.html
)
pause
