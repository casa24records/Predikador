#!/bin/bash

echo "========================================"
echo "  Casa 24 Records Discord Bot"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and add your credentials"
    echo ""
    read -p "Press any key to exit..."
    exit 1
fi

# Check for placeholder token
if grep -q "PASTE_YOUR_BOT_TOKEN_HERE" .env; then
    echo "========================================"
    echo "WARNING: Bot token not configured!"
    echo "========================================"
    echo ""
    echo "Please add your Discord credentials:"
    echo "1. Edit the .env file"
    echo "2. Replace PASTE_YOUR_BOT_TOKEN_HERE with your bot token"
    echo "3. Replace PASTE_YOUR_CLIENT_ID_HERE with your client ID"
    echo ""
    echo "Get these from: https://discord.com/developers/applications"
    echo ""
    read -p "Press any key to exit..."
    exit 1
fi

echo "Starting bot..."
echo "Press Ctrl+C to stop the bot"
echo ""
node index.js

if [ $? -ne 0 ]; then
    echo ""
    echo "Bot crashed or was stopped."
    read -p "Press any key to exit..."
fi