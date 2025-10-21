@echo off
echo ========================================
echo   Casa 24 Records Discord Bot
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and add your credentials
    echo.
    pause
    exit /b 1
)

REM Check for placeholder token
findstr /C:"PASTE_YOUR_BOT_TOKEN_HERE" .env >nul
if %errorlevel%==0 (
    echo ========================================
    echo WARNING: Bot token not configured!
    echo ========================================
    echo.
    echo Please add your Discord credentials:
    echo 1. Edit the .env file
    echo 2. Replace PASTE_YOUR_BOT_TOKEN_HERE with your bot token
    echo 3. Replace PASTE_YOUR_CLIENT_ID_HERE with your client ID
    echo.
    echo Get these from: https://discord.com/developers/applications
    echo.
    pause
    exit /b 1
)

echo Starting bot...
echo Press Ctrl+C to stop the bot
echo.
node index.js

if %errorlevel% neq 0 (
    echo.
    echo Bot crashed or was stopped.
    pause
)