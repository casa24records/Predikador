# 🚀 Discord Bot Deployment Options

## Understanding the Basics

**GitHub Secrets** = Secure storage for your token
**Bot Hosting** = Where your bot actually runs

Your bot needs to run somewhere 24/7 to stay online in Discord!

---

## 🆓 Option 1: Railway.app (Recommended - Free Tier)

### Setup (10 minutes):
1. Go to [Railway.app](https://railway.app/)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `BOMB` repository
5. Add environment variable:
   - `DISCORD_BOT_TOKEN` = your new token
6. Railway will auto-deploy and run your bot 24/7!

### Pros:
- ✅ Free tier (500 hours/month)
- ✅ Auto-deploys when you push to GitHub
- ✅ 24/7 uptime
- ✅ Easy setup

---

## 🆓 Option 2: Render.com (Free Tier)

### Setup (10 minutes):
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. New → Web Service
4. Connect your `BOMB` repository
5. Settings:
   - Build Command: `cd bot && npm install`
   - Start Command: `cd bot && node index.js`
6. Add environment variable:
   - `DISCORD_BOT_TOKEN` = your new token
7. Deploy!

### Pros:
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ⚠️ Free tier may sleep after 15 min inactivity

---

## 💻 Option 3: Your Computer (Current)

### Setup:
1. Update `bot/.env.local` with new token:
   ```
   DISCORD_BOT_TOKEN=YOUR_NEW_TOKEN_HERE
   ```
2. Run:
   ```bash
   cd bot
   start.bat
   ```

### Pros:
- ✅ Completely free
- ✅ Full control
- ❌ Only online when PC is on
- ❌ Uses your internet/electricity

---

## ☁️ Option 4: GitHub Actions (Limited)

### What it can do:
- Run bot for scheduled periods (not 24/7)
- Good for scheduled tasks (daily reports)
- NOT good for real-time commands

### Setup:
Create `.github/workflows/bot-schedule.yml`:

```yaml
name: Run Bot Periodically

on:
  schedule:
    # Runs every 6 hours for 5 minutes
    - cron: '0 */6 * * *'
  workflow_dispatch: # Manual trigger

jobs:
  run-bot:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        cd bot
        npm ci

    - name: Run bot
      env:
        DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
        DISCORD_CLIENT_ID: 1428908204712132752
        DISCORD_GUILD_ID: 1415514542405976146
      run: |
        cd bot
        timeout 5m node index.js || true
```

### Limitations:
- ⚠️ Max 6 hours/month on free tier
- ⚠️ Not suitable for 24/7 bot
- ✅ Good for scheduled tasks

---

## 💰 Paid Options (If Needed Later)

1. **VPS Hosting** ($5-10/month)
   - DigitalOcean, Linode, Vultr
   - Full control, always online

2. **Discord Bot Hosting** ($3-5/month)
   - Bot-specific hosting services
   - Easy setup, optimized for Discord

---

## 🎯 Quick Recommendation

**For 24/7 Free Bot:**
1. Use Railway.app (easiest)
2. Connect GitHub repo
3. Add your token
4. Done!

**For Testing/Development:**
1. Keep using local setup
2. Use .env.local file
3. Run when needed

**For Scheduled Tasks Only:**
1. Use GitHub Actions
2. Run periodically (not 24/7)

---

## ⚡ Quick Start with Railway

```bash
# 1. First, get your new token from Discord Developer Portal
# 2. Go to railway.app
# 3. Click "Start New Project"
# 4. Choose "Deploy from GitHub repo"
# 5. Select BOMB repository
# 6. Add environment variable:
#    DISCORD_BOT_TOKEN = [your-new-token]
# 7. Deploy! Bot will be online 24/7
```

---

## 📝 Important Notes

1. **GitHub Secrets** are only accessible when code runs ON GitHub (Actions)
2. **Local .env.local** is for running on your computer
3. **Cloud hosting** needs tokens added to THEIR dashboard (not GitHub)
4. **Discord bots** need to run continuously to respond to commands

Choose based on your needs:
- **24/7 bot?** → Railway/Render
- **Just testing?** → Local computer
- **Scheduled tasks?** → GitHub Actions