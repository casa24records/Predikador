@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Casa 24 Records - Credential Setup Script (Windows)
REM ============================================

title Casa 24 Records - Credential Manager

:MENU
cls
echo ============================================
echo    Casa 24 Records - Credential Manager
echo ============================================
echo.
echo Select deployment target:
echo.
echo 1) Local Development (Docker Compose)
echo 2) GitHub Secrets (using gh CLI)
echo 3) Create .env from template
echo 4) Validate existing credentials
echo 5) Remove sensitive files
echo 0) Exit
echo.
set /p choice="Enter your choice: "

if "%choice%"=="1" goto LOCAL_SETUP
if "%choice%"=="2" goto GITHUB_SETUP
if "%choice%"=="3" goto ENV_TEMPLATE
if "%choice%"=="4" goto VALIDATE
if "%choice%"=="5" goto CLEANUP
if "%choice%"=="0" goto END

echo Invalid choice!
pause
goto MENU

:LOCAL_SETUP
echo.
echo [+] Setting up local environment...
echo.

REM Check if .env.template exists
if not exist "..\..\\.env.template" (
    echo [!] .env.template not found!
    pause
    goto MENU
)

REM Check if .env already exists
if exist "..\..\\.env" (
    echo [!] .env file already exists!
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "!overwrite!"=="y" (
        echo [+] Keeping existing .env file
        pause
        goto MENU
    )
)

REM Copy template
copy "..\..\\.env.template" "..\..\\.env" >nul
echo [+] Created .env file from template
echo.

REM Interactive credential setup
echo Please enter your credentials:
echo (Press Enter to skip optional fields)
echo.

REM Discord credentials
set /p discord_token="Discord Bot Token: "
if not "!discord_token!"=="" (
    powershell -Command "(gc ..\..\\.env) -replace 'YOUR_DISCORD_BOT_TOKEN_HERE', '!discord_token!' | Out-File -encoding ASCII ..\..\\.env"
    echo [+] Discord token configured
)

set /p discord_client="Discord Client ID: "
if not "!discord_client!"=="" (
    powershell -Command "(gc ..\..\\.env) -replace 'YOUR_DISCORD_CLIENT_ID_HERE', '!discord_client!' | Out-File -encoding ASCII ..\..\\.env"
    echo [+] Discord client ID configured
)

set /p discord_guild="Discord Guild ID: "
if not "!discord_guild!"=="" (
    powershell -Command "(gc ..\..\\.env) -replace 'YOUR_DISCORD_GUILD_ID_HERE', '!discord_guild!' | Out-File -encoding ASCII ..\..\\.env"
    echo [+] Discord guild ID configured
)

echo.
echo [+] Local environment setup complete!
echo [!] Remember: Never commit .env to Git!
pause
goto MENU

:GITHUB_SETUP
echo.
echo [+] Setting up GitHub Secrets...
echo.

REM Check if gh CLI is installed
where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] GitHub CLI (gh) is not installed!
    echo Install from: https://cli.github.com/
    pause
    goto MENU
)

REM Check if authenticated
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Not authenticated with GitHub
    gh auth login
)

echo.
echo Enter credentials to store in GitHub Secrets:
echo.

REM Discord Bot Token
set /p discord_token="Discord Bot Token: "
if not "!discord_token!"=="" (
    echo !discord_token! | gh secret set DISCORD_BOT_TOKEN
    echo [+] DISCORD_BOT_TOKEN added to GitHub Secrets
)

REM Discord Client ID
set /p discord_client="Discord Client ID: "
if not "!discord_client!"=="" (
    echo !discord_client! | gh secret set DISCORD_CLIENT_ID
    echo [+] DISCORD_CLIENT_ID added to GitHub Secrets
)

REM Discord Guild ID
set /p discord_guild="Discord Guild ID: "
if not "!discord_guild!"=="" (
    echo !discord_guild! | gh secret set DISCORD_GUILD_ID
    echo [+] DISCORD_GUILD_ID added to GitHub Secrets
)

echo.
echo [+] GitHub Secrets setup complete!
pause
goto MENU

:ENV_TEMPLATE
echo.
echo [+] Creating .env from template...
echo.

if not exist "..\..\\.env.template" (
    echo [!] .env.template not found!
    pause
    goto MENU
)

copy "..\..\\.env.template" "..\..\\.env.setup" >nul
echo [+] Created .env.setup from template
echo.
echo Edit .env.setup with your credentials, then rename to .env
echo Opening in notepad...
notepad "..\..\\.env.setup"
pause
goto MENU

:VALIDATE
echo.
echo [+] Validating credentials...
echo.

if exist "..\..\\.env" (
    echo [+] .env file exists

    REM Check for placeholder values
    findstr "YOUR_.*_HERE" "..\..\\.env" >nul
    if %errorlevel% equ 0 (
        echo [!] Warning: Placeholder values found in .env
        echo Please replace all YOUR_*_HERE placeholders
    ) else (
        echo [+] No placeholder values found
    )
) else (
    echo [!] .env file not found
)

if exist "..\\..\\bot\\.env" (
    echo [!] WARNING: bot/.env exists and may contain credentials!
    echo This file should be removed for security
)

if exist "..\\..\\bot\\.env.local" (
    echo [!] WARNING: bot/.env.local exists and may contain credentials!
    echo This file should be removed for security
)

echo.
pause
goto MENU

:CLEANUP
echo.
echo [+] Cleaning up sensitive files...
echo.

set cleaned=0

if exist "..\\..\\bot\\.env" (
    del "..\\..\\bot\\.env"
    echo [+] Removed bot/.env
    set cleaned=1
)

if exist "..\\..\\bot\\.env.local" (
    del "..\\..\\bot\\.env.local"
    echo [+] Removed bot/.env.local
    set cleaned=1
)

if !cleaned! equ 0 (
    echo [+] No sensitive files found to clean
)

echo.
echo [+] Cleanup complete!
pause
goto MENU

:END
echo.
echo Goodbye!
exit /b 0