@echo off
echo ============================================
echo Advanced Terminal - Windows Build Quick Fix
echo ============================================
echo.
echo This script will try multiple fixes for node-pty build errors.
echo.
echo Press Ctrl+C to cancel at any time.
echo.
pause

echo.
echo [1/5] Cleaning up previous installation...
if exist node_modules (
    echo Removing node_modules folder...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json 2>nul
)

echo.
echo [2/5] Clearing npm cache...
call npm cache clean --force

echo.
echo [3/5] Checking Windows SDK version...
echo Installed Windows SDK versions:
dir "C:\Program Files (x86)\Windows Kits\10\Include" 2>nul
echo.
echo You need Windows SDK 10.0.17763.0 or higher for ConPTY support.
echo.

echo.
echo [4/5] Installing with exact node-pty version...
echo This uses node-pty 1.0.0 which is more compatible.
echo.
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo SUCCESS! Installation completed.
    echo ============================================
    echo.
    echo You can now run:
    echo   npm run dev    (development mode)
    echo   npm start      (production mode)
    echo.
) else (
    echo.
    echo ============================================
    echo Installation failed. Trying alternative fix...
    echo ============================================
    echo.
    echo [5/5] Trying with older Node.js ABI version...
    call npm install node-pty@0.10.1 --save-exact --force
    call npm install

    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================
        echo SUCCESS with older node-pty version!
        echo ============================================
        echo.
    ) else (
        echo.
        echo ============================================
        echo Build still failing. Please check SDK-FIX.md
        echo ============================================
        echo.
        echo Possible solutions:
        echo 1. Update Windows 10 SDK via Visual Studio Installer
        echo 2. Install Windows SDK 10.0.19041.0 or later
        echo 3. Check Node.js version (recommend v20 LTS)
        echo.
        echo See SDK-FIX.md for detailed instructions.
        echo.
    )
)

pause
