@echo off
setlocal
echo Iniciando servidor local para Digiturno...
echo.

REM Preferir npx serve si está disponible. Iniciamos en una nueva ventana para no bloquear.
echo Intentando iniciar con 'npx serve' en el puerto 3000...
where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
	start "Digiturno Server" cmd /c "npx serve public --listen 3000"
	ping -n 2 127.0.0.1 > nul
	echo Abriendo navegador en http://localhost:3000/html/login.html
	start "" "http://localhost:3000/html/login.html"
	goto end
)

echo 'npx' no encontrado. Intentando con Python...
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
	start "Digiturno Server" cmd /c "cd /d %~dp0public && python -m http.server 3000"
	ping -n 2 127.0.0.1 > nul
	echo Abriendo navegador en http://localhost:3000/html/login.html
	start "" "http://localhost:3000/html/login.html"
	goto end
)

echo.
echo No se pudo iniciar el servidor. Asegurate de tener Node.js (npx) o Python instalados.
pause

:end
endlocal
