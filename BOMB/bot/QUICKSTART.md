# 🚀 Casa 24 Discord Bot - Quick Start Guide

Get your bot running in **5 minutes**!

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download here](https://nodejs.org/))
- [ ] Discord account
- [ ] Admin access to your Discord server

## Step 1: Create Discord Bot (3 minutes)

### 1.1 Create Application
1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it: `Casa 24 Stats Bot`
4. Click **"Create"**

### 1.2 Create Bot User
1. Click **"Bot"** in left sidebar
2. Click **"Add Bot"** → **"Yes, do it!"**
3. Click **"Reset Token"** → **"Yes, do it!"**
4. **COPY THE TOKEN** (you'll need this!)
   - ⚠️ **Important**: Save this somewhere safe, you can't see it again!

### 1.3 Get Client ID
1. Click **"OAuth2"** → **"General"** in left sidebar
2. Copy the **"Client ID"** (under "Application ID")

### 1.4 Invite Bot to Server
1. Click **"OAuth2"** → **"URL Generator"**
2. Under **"Scopes"**, check:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **"Bot Permissions"**, check:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Use Slash Commands
4. Copy the **Generated URL** at bottom
5. Open URL in browser → Select your server → **"Authorize"**

## Step 2: Install Bot (2 minutes)

### 2.1 Open Terminal
```bash
# Navigate to bot directory
cd "c:\Users\14049\OneDrive\Documents\Website\BOMB\BOMB-1\bot"
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment File
```bash
# Copy example file
copy .env.example .env

# Edit .env file (use Notepad or VS Code)
notepad .env
```

### 2.4 Configure .env
Replace placeholders with your values:
```env
DISCORD_BOT_TOKEN=your_bot_token_from_step_1.2
DISCORD_CLIENT_ID=your_client_id_from_step_1.3
DISCORD_GUILD_ID=1000913895415877712

DATA_PATH=../data/latest.json
HISTORICAL_DATA_PATH=../data/historical
```

**How to get Guild ID**:
1. Enable Developer Mode in Discord:
   - User Settings → Advanced → Developer Mode (toggle ON)
2. Right-click your server name → **"Copy Server ID"**
3. Paste as `DISCORD_GUILD_ID`

## Step 3: Deploy & Run (<1 minute)

### 3.1 Deploy Slash Commands
```bash
node deploy-commands.js
```

You should see:
```
✅ Successfully deployed 4 slash commands!
📝 Deployed commands:
   • /stats - Show current Casa 24 Records analytics
   • /growth - Show growth trends for Casa 24 Records
   • /predict - Predict future metrics using AI
   • /artist - Show detailed stats for a specific artist
```

### 3.2 Start Bot
```bash
npm start
```

You should see:
```
🚀 Starting Casa 24 Records Discord Bot...
📦 Loading commands...
   ✓ Loaded command: /stats
   ✓ Loaded command: /growth
   ✓ Loaded command: /predict
   ✓ Loaded command: /artist

✅ Discord bot is online!
   Logged in as: Casa 24 Stats Bot#1234
   Serving 1 server(s)
   Commands loaded: 4

🎵 Casa 24 Records Bot is ready to serve stats!
```

## Step 4: Test Commands

Go to your Discord server and try:

### Test `/stats`
```
/stats
```
Should show current analytics for all artists.

### Test `/growth`
```
/growth period:30
```
Should show 30-day growth trends.

### Test `/predict`
```
/predict artist:Casa 24 days:30
```
Should show AI predictions for next 30 days.

### Test `/artist`
```
/artist name:Chef Lino
```
Should show detailed stats for Chef Lino (with autocomplete!).

## Troubleshooting

### ❌ "Bot not responding"
- **Check**: Is bot online? Look for green dot next to bot name in server members
- **Fix**: Restart bot with `npm start`

### ❌ "Commands not appearing"
- **Check**: Did you run `node deploy-commands.js`?
- **Wait**: Global commands can take up to 1 hour to appear
- **Fix**: Add `DISCORD_GUILD_ID` to `.env` for instant guild-specific commands

### ❌ "Invalid token"
- **Check**: Did you copy the full token from Discord Developer Portal?
- **Fix**: Get a new token: Developer Portal → Bot → Reset Token

### ❌ "Failed to load analytics data"
- **Check**: Does `../data/latest.json` exist?
- **Check**: Run `dir ..\data\latest.json` to verify
- **Fix**: Make sure you're in the correct directory (`bot/` folder)

### ❌ "Permission denied"
- **Check**: Bot has correct permissions in Discord server
- **Fix**: Server Settings → Roles → Find bot role → Enable permissions

## Development Mode

For auto-reload during development:
```bash
npm run dev
```

Bot will restart automatically when you edit files.

## Stop Bot

Press `Ctrl+C` in terminal to stop the bot gracefully.

## Next Steps

✅ Bot is running!

**Now you can**:
- Share `/stats` in your server daily
- Track growth with `/growth`
- Predict future metrics with `/predict`
- Deep dive into artists with `/artist`

**Future ideas**:
- Schedule daily stats posts
- Set up alerts for milestones
- Add custom commands for your collective

## Need Help?

Check the full README.md for:
- Detailed command documentation
- Customization guide
- API reference
- Advanced configuration

---

**🎵 Enjoy your Casa 24 Records Discord Bot!**

*Made with 💚 by Casa 24 Records*
