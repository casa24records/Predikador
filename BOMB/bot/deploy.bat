@echo off
echo ========================================
echo   Deploy Casa 24 Bot Commands
echo ========================================
echo.

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
    echo ERROR: Discord credentials not configured!
    echo.
    echo Please add your Discord credentials first:
    echo 1. Edit the .env file
    echo 2. Replace PASTE_YOUR_BOT_TOKEN_HERE with your bot token
    echo 3. Replace PASTE_YOUR_CLIENT_ID_HERE with your client ID
    echo.
    echo Get these from: https://discord.com/developers/applications
    echo.
    pause
    exit /b 1
)

echo Deploying slash commands to Discord...
echo.
node deploy-commands.js

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS: Commands deployed!
    echo ========================================
    echo.
    echo You can now start the bot with: start.bat
    echo.
) else (
    echo.
    echo ERROR: Failed to deploy commands
    echo Check your credentials and try again
    echo.
)

pause