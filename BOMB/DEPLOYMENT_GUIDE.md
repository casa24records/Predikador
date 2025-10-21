# 🚀 Casa 24 Bot - Simple Deployment Guide

## ONE-PLACE Configuration: GitHub Secrets

This guide shows you how to configure your bot credentials in **GitHub Secrets ONLY** - no confusing multi-file configuration!

---

## Step 1: Get Your Discord Bot Credentials (5 minutes)

### 1.1 Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it: `Casa24 Analytics Bot`
4. Click **"Create"**

### 1.2 Get Your Client ID
1. In the application page, go to **"OAuth2"** → **"General"**
2. Copy the **"CLIENT ID"**
3. Save it somewhere temporarily (you'll add it to GitHub Secrets soon)

### 1.3 Create Bot User
1. Go to **"Bot"** tab on the left
2. Click **"Add Bot"** → **"Yes, do it!"**
3. Under **"TOKEN"**, click **"Reset Token"** → **"Yes, do it!"**
4. Click **"Copy"** to copy your bot token
5. **IMPORTANT**: Save this token somewhere safe (you can only see it once!)

### 1.4 Set Bot Permissions
1. Still in the **"Bot"** tab, scroll to **"Privileged Gateway Intents"**
2. Enable:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
3. Click **"Save Changes"**

### 1.5 Invite Bot to Your Server
1. Go to **"OAuth2"** → **"URL Generator"**
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ `Send Messages`
   - ✅ `Embed Links`
   - ✅ `Use Slash Commands`
4. Copy the generated URL at the bottom
5. Paste it in your browser and invite the bot to your Discord server

### 1.6 Get Your Guild ID (Server ID)
1. In Discord, go to **User Settings** → **Advanced**
2. Enable **"Developer Mode"**
3. Right-click your server name → **"Copy Server ID"**
4. Save this ID

**You should now have:**
- ✅ Discord Bot Token (a long string starting with `MTI...`)
- ✅ Client ID (18-19 digit number like: `1234567890123456789`)
- ✅ Guild ID (18-19 digit number like: `9876543210987654321`)

---

## Step 2: Add Secrets to GitHub (2 minutes)

### 2.1 Go to Your Repository Secrets
1. Open your repository: https://github.com/casa24records/claude
2. Click **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### 2.2 Add Each Secret

Add these **3 secrets** one by one:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `DISCORD_BOT_TOKEN` | Your bot token from Step 1.3 | `MTIzNDU2Nzg5...` |
| `DISCORD_CLIENT_ID` | Your client ID from Step 1.2 | `1234567890123456789` |
| `DISCORD_GUILD_ID` | Your guild ID from Step 1.6 | `9876543210987654321` |

**For each secret:**
1. Click **"New repository secret"**
2. Enter the **Name** (exactly as shown above)
3. Paste the **Value**
4. Click **"Add secret"**

**That's it!** ✅ All your credentials are now stored in ONE place (GitHub Secrets).

---

## Step 3: Deploy to Railway (3 minutes)

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

### 3.2 Create New Project
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `casa24records/claude`
4. Railway will ask for permissions → Click **"Install & Authorize"**

### 3.3 Configure the Service
1. After Railway connects, click **"Add variables"**
2. Click **"RAW Editor"** tab
3. Paste this:
   ```
   DISCORD_BOT_TOKEN=${{secrets.DISCORD_BOT_TOKEN}}
   DISCORD_CLIENT_ID=${{secrets.DISCORD_CLIENT_ID}}
   DISCORD_GUILD_ID=${{secrets.DISCORD_GUILD_ID}}
   NODE_ENV=production
   DATA_PATH=../data/latest.json
   HISTORICAL_DATA_PATH=../data/historical
   ```
4. Click **"Update Variables"**

### 3.4 Set Build Configuration
1. In Railway project, click **"Settings"**
2. Under **"Build"**:
   - **Root Directory**: `BOMB/bot`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Under **"Deploy"**:
   - **Watch Paths**: `BOMB/bot/**`
4. Click **"Deploy"**

### 3.5 Wait for Deployment
- Railway will automatically build and deploy your bot
- Watch the **"Deployments"** tab for progress
- When you see ✅ **"Success"**, your bot is online!

---

## Step 4: Verify Bot is Working (1 minute)

1. Open Discord
2. Go to your server where you invited the bot
3. Type `/` in any channel
4. You should see Casa 24 bot commands like:
   - `/stats` - View collective analytics
   - `/artist` - Check individual artist stats
   - `/growth` - See growth trends
   - `/predict` - AI predictions

**Try it**: Type `/stats` and press Enter

**If it works** → 🎉 **SUCCESS! Your bot is live!**

---

## 🔄 Automatic Updates

From now on, whenever you push code to GitHub:
1. Railway automatically detects the change
2. Rebuilds the bot
3. Redeploys with your GitHub Secrets
4. Bot updates in ~2 minutes

**You never need to reconfigure credentials!**

---

## 🛠️ Troubleshooting

### Bot Shows Offline in Discord
1. Check Railway logs: Railway Dashboard → Your Project → **"View Logs"**
2. Look for errors like `Invalid token` or `Missing permissions`

### Commands Don't Show in Discord
Run this command locally first:
```bash
cd BOMB/bot
npm install
node deploy-commands.js
```
This registers the slash commands with Discord.

### Railway Deployment Fails
1. Check the build logs in Railway
2. Verify your GitHub Secrets are named exactly:
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_GUILD_ID`

---

## 📊 What Happens Next

### Daily Data Collection (Already Configured)
- GitHub Actions runs automatically at 2:30 AM UTC
- Collects Spotify, YouTube, Instagram data
- Saves to `data/latest.json`
- Bot automatically uses the latest data

### Bot Commands Available
- `/stats` - Real-time collective analytics
- `/artist [name]` - Individual artist deep dive
- `/growth [period]` - Growth trends (7-90 days)
- `/predict [artist] [days]` - AI-powered forecasting
- `/battle [artist1] [artist2]` - Artist head-to-head
- `/leaderboard [metric]` - Rankings across metrics
- `/momentum [artist]` - Growth acceleration tracking
- `/viral [timeframe]` - Viral content detector
- `/achievements [artist]` - Achievement system
- `/milestones [artist]` - Milestone tracker
- `/spotlight` - Random artist showcase
- `/weekly [offset]` - Comprehensive weekly reports

---

## 💰 Cost Breakdown

| Service | Cost | What It Provides |
|---------|------|------------------|
| GitHub | $0 | Code storage, Secrets, Actions (2000 min/mo) |
| Railway | $5 credit/mo (free) | 24/7 bot hosting, auto-deploy |
| Discord API | $0 | Bot platform |
| **TOTAL** | **$0/month** | Full production setup |

---

## 🎯 Summary

**What you did:**
1. ✅ Created Discord bot → Got 3 credentials
2. ✅ Added 3 secrets to GitHub → ONE place configuration
3. ✅ Connected Railway to GitHub → Auto-deployment
4. ✅ Bot is now live 24/7 → Responds to Discord commands

**What happens automatically:**
- ✅ GitHub Actions collects data daily
- ✅ Railway redeploys when you push code
- ✅ Bot reads credentials from GitHub Secrets
- ✅ No multi-file configuration headaches!

---

## 📞 Need Help?

If something doesn't work, check:
1. Railway logs (for bot errors)
2. GitHub Actions logs (for data collection errors)
3. Discord Developer Portal (for permission issues)

**Your bot is now production-ready!** 🚀
