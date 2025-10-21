# ✅ Simple 3-Step Setup - One Place for All Credentials

## 🎯 Your SINGLE Source of Truth: GitHub Secrets

No confusing multi-file configuration! Everything is in ONE place.

---

## Step 1: Add Discord Bot Credentials to GitHub Secrets (5 min)

### Get Your Discord Bot Set Up:
1. Go to https://discord.com/developers/applications
2. Click **"New Application"** → Name it `Casa24 Bot` → **Create**
3. Go to **"Bot"** tab → Click **"Add Bot"**
4. Click **"Reset Token"** → Copy and save the token
5. Go to **"OAuth2"** → Copy your **Client ID**
6. Invite bot to your server using OAuth2 URL Generator
7. In Discord: Right-click your server → **Copy Server ID** (enable Developer Mode first)

### Add to GitHub Secrets:
1. Go to: https://github.com/casa24records/claude/settings/secrets/actions
2. Click **"New repository secret"** and add these 3 secrets:

| Name | Value |
|------|-------|
| `DISCORD_BOT_TOKEN` | The token you copied |
| `DISCORD_CLIENT_ID` | Your client ID |
| `DISCORD_GUILD_ID` | Your server ID |

**Done!** ✅ Credentials stored in ONE place.

---

## Step 2: Deploy to Railway (3 min)

### Connect Railway to GitHub:
1. Go to https://railway.app
2. Click **"Login with GitHub"**
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: `casa24records/claude`
5. Railway will detect your `railway.json` config automatically ✅

### Set Environment Variables in Railway:
1. In your Railway project, click **"Variables"**
2. Add these 3 variables (paste your actual values from Step 1):

```
DISCORD_BOT_TOKEN=your_actual_token_here
DISCORD_CLIENT_ID=your_actual_client_id
DISCORD_GUILD_ID=your_actual_guild_id
```

3. Click **"Deploy"**

**Railway will:**
- ✅ Build your bot from `BOMB/bot/`
- ✅ Install dependencies
- ✅ Start the bot 24/7
- ✅ Auto-redeploy when you push to GitHub

---

## Step 3: Register Commands & Test (2 min)

### Register Slash Commands (One-time only):
```bash
cd BOMB/bot
npm install
node deploy-commands.js
```

This tells Discord about your bot's commands.

### Test in Discord:
1. Open your Discord server
2. Type `/stats`
3. Press Enter

**If you see bot stats → 🎉 SUCCESS!**

---

## 🔄 What Happens Now

### Automatic Updates Forever:
```
You push code to GitHub
    ↓
Railway auto-detects change
    ↓
Rebuilds & redeploys bot (2 min)
    ↓
Bot is live with updates!
```

### Daily Data Collection (Already Working):
- GitHub Actions runs at 2:30 AM UTC
- Collects Spotify/YouTube/Instagram data
- Saves to `data/latest.json`
- Bot automatically uses latest data

---

## 💰 Total Cost: $0/month

| Service | Cost |
|---------|------|
| GitHub | Free |
| Railway | $5 credit/mo (free tier) |
| Discord | Free |

---

## 📝 Quick Reference

**Where credentials are stored:**
- ✅ GitHub Secrets (production)
- ✅ Railway Variables (deployment)
- ❌ No `.env` files to manage!

**Available commands in Discord:**
- `/stats` - Live analytics
- `/artist [name]` - Artist deep dive
- `/growth [period]` - Growth trends
- `/predict [artist] [days]` - AI forecasting
- `/battle [artist1] [artist2]` - Compare artists
- `/leaderboard [metric]` - Rankings
- And 6 more!

**Deployment status:**
- Check Railway dashboard: https://railway.app/dashboard
- View logs: Click your project → "View Logs"

---

## 🆘 Troubleshooting

**Bot offline?**
→ Check Railway logs for errors

**Commands not showing?**
→ Run `node deploy-commands.js` again

**Deployment failed?**
→ Verify secret names match exactly:
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_CLIENT_ID`
  - `DISCORD_GUILD_ID`

---

That's it! Your bot is now:
- ✅ Running 24/7 on Railway
- ✅ Configured in ONE place (GitHub Secrets)
- ✅ Auto-updating on every push
- ✅ Collecting data daily

**No complex multi-file configuration!** 🚀
