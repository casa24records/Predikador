# 🔐 GitHub Secrets Setup Guide for Discord Bot

## ⚠️ IMPORTANT: Your Token Was Exposed!

Since your Discord bot token was exposed in the public repository, Discord will likely revoke it soon. You'll need to:
1. **Regenerate your bot token** in Discord Developer Portal
2. **Set it up securely** using this guide

---

## 📋 Step 1: Regenerate Your Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications/1428908204712132752/bot)
2. In the **Bot** section, click **"Reset Token"**
3. Copy the new token immediately (you can't view it again!)
4. Save it somewhere secure temporarily

---

## 🔧 Step 2: Add Token to GitHub Secrets

### Navigate to GitHub Secrets:
1. Go to your repository: https://github.com/Heisenberga17/BOMB
2. Click **Settings** tab (in the repository, not your profile)
3. In the left sidebar, scroll down to **Security** section
4. Click **Secrets and variables** → **Actions**
5. Click **New repository secret** button (green button)

### Create the Secret:
- **Name**: `DISCORD_BOT_TOKEN`
  - ⚠️ Use this EXACT name (all caps, underscores)
- **Secret**: Paste your new bot token here
- Click **Add secret**

### Also Add These Secrets (Optional but Recommended):
- **Name**: `DISCORD_CLIENT_ID`
  - **Value**: `1428908204712132752`
- **Name**: `DISCORD_GUILD_ID`
  - **Value**: `1415514542405976146`

---

## 💻 Step 3: Local Development Setup

For running the bot on your local machine:

1. **Keep using .env.local** (already created):
   ```bash
   cd bot
   # The .env.local file is already gitignored
   ```

2. **Update .env.local with new token**:
   ```env
   DISCORD_BOT_TOKEN=YOUR_NEW_TOKEN_HERE
   DISCORD_CLIENT_ID=1428908204712132752
   DISCORD_GUILD_ID=1415514542405976146
   ```

3. **Never commit .env.local** (already in .gitignore)

---

## 🚀 Step 4: Running the Bot

### Locally (Your Computer):
```bash
cd bot
# Bot will automatically use .env.local if it exists
start.bat
```

### On GitHub Actions (Optional - for 24/7 hosting):
If you want to run the bot using GitHub Actions, create `.github/workflows/run-bot.yml`:

```yaml
name: Run Discord Bot

on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '*/30 * * * *' # Run every 30 minutes

jobs:
  run-bot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd bot
          npm install

      - name: Run bot for 25 minutes
        env:
          DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
          DISCORD_CLIENT_ID: ${{ secrets.DISCORD_CLIENT_ID }}
          DISCORD_GUILD_ID: ${{ secrets.DISCORD_GUILD_ID }}
        run: |
          cd bot
          timeout 25m node index.js || true
```

---

## 🔍 Step 5: Verify Your Setup

### Check if Secrets are Set:
1. Go to Settings → Secrets → Actions
2. You should see:
   - `DISCORD_BOT_TOKEN` (will show as ****)
   - Cannot view the actual value (this is good!)

### Test Locally:
```bash
cd bot
node test-connection.js
```

Should output:
```
✅ Bot token found
✅ Client ID: 1428908204712132752
🎉 SUCCESS! Bot connected!
```

---

## 📝 How Your Code Uses Secrets

The bot now works in two modes:

### 1. **Local Development** (Your Computer):
```javascript
// Loads from .env.local (not in GitHub)
dotenv.config({ path: '.env.local' });
```

### 2. **GitHub Actions** (If you set it up):
```javascript
// Uses secrets from GitHub: ${{ secrets.DISCORD_BOT_TOKEN }}
process.env.DISCORD_BOT_TOKEN // Automatically set by GitHub
```

---

## 🛡️ Security Best Practices

### ✅ DO:
- Use `.env.local` for local development
- Add all tokens to GitHub Secrets
- Keep `.env.local` in `.gitignore`
- Regenerate tokens if exposed

### ❌ DON'T:
- Commit actual tokens to GitHub
- Share tokens in Discord/chat
- Use the same token for dev/prod
- Hardcode tokens in code

---

## 🆘 Troubleshooting

### "Bot token invalid" Error:
- Token was revoked by Discord
- Regenerate token in Developer Portal
- Update in GitHub Secrets
- Update in .env.local

### "Cannot find secret" in GitHub Actions:
- Secret name must be exact: `DISCORD_BOT_TOKEN`
- Check for typos or extra spaces
- Secrets are case-sensitive

### Bot works locally but not on GitHub:
- Verify secret is set in GitHub
- Check workflow file syntax
- Look at Actions tab for error logs

---

## 🎯 Quick Reference

| Location | File | Purpose |
|----------|------|---------|
| Local Dev | `.env.local` | Your actual token (git ignored) |
| GitHub Repo | `.env` | Placeholder only (safe to commit) |
| GitHub Secrets | `DISCORD_BOT_TOKEN` | Production token (encrypted) |
| Your Code | `process.env.DISCORD_BOT_TOKEN` | Reads from either source |

---

## 📚 Summary

1. **Regenerate token** (since it was exposed)
2. **Add to GitHub Secrets** as `DISCORD_BOT_TOKEN`
3. **Use .env.local** for local development
4. **Never commit real tokens** to GitHub

Your bot is now secure and can run both locally and on GitHub! 🎉