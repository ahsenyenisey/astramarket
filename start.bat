@echo off
REM ============================================================
REM AstraMarket - Windows icin baslatma scripti
REM
REM Onkosul: XAMPP'in MySQL servisini Control Panel uzerinden
REM ELLE baslatmis olmalisin (bu script onu acmaz).
REM
REM Bu script: Backend ve Frontend'i iki ayri pencerede acar.
REM ============================================================

setlocal

set PROJE_DIR=%~dp0
cd /d "%PROJE_DIR%"

echo.
echo ============================================================
echo  AstraMarket baslatiliyor (Windows)
echo ============================================================
echo.
echo [!] XAMPP Control Panel'de MySQL'in calistigindan emin ol.
echo.

REM Backend bagimliliklarini kontrol et
if not exist "backend\node_modules" (
  echo [+] Backend bagimliliklari yukleniyor...
  cd backend
  call npm install
  cd ..
)

REM .env dosyasini kontrol et
if not exist "backend\.env" (
  echo [+] .env dosyasi olusturuluyor...
  copy "backend\.env.example" "backend\.env" >nul
)

REM Frontend bagimliliklarini kontrol et
if not exist "frontend\node_modules" (
  echo [+] Frontend bagimliliklari yukleniyor (birkac dakika surebilir)...
  cd frontend
  call npm install
  cd ..
)

echo.
echo [+] Backend yeni pencerede baslatiliyor (port 4000)...
start "AstraMarket Backend" cmd /k "cd backend && npm run dev"

REM Backend'in baslamasini bekle
timeout /t 3 /nobreak >nul

echo [+] Frontend yeni pencerede baslatiliyor (port 5173)...
start "AstraMarket Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo  Hazir!
echo ============================================================
echo  Backend  -^> http://localhost:4000
echo  Frontend -^> http://localhost:5173
echo.
echo  Tarayicidan: http://localhost:5173
echo.
echo  Iki yeni pencere acildi, onlari kapatmadan calismaya devam et.
echo  Durdurmak icin: pencereleri kapat veya her birinde Ctrl+C.
echo ============================================================
echo.

pause
endlocal
