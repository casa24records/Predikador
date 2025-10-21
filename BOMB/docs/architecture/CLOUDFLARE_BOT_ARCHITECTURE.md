# 🌐 Discord Bot + Cloudflare Architecture

## Current Setup ✅
You already have:
- **Cloudflare Worker**: API for credentials (`casa24-api.casa24records.workers.dev`)
- **GitHub Actions**: Daily data collection at 2:30 AM UTC
- **GitHub Repo**: Data storage + bot code

## The Problem ❌
**Cloudflare CANNOT host Discord bots** because:
- Discord bots need WebSocket connections (always-on)
- Cloudflare Workers timeout after 30 seconds
- Workers are stateless (can't maintain bot connection)

---

## Solution: Hybrid Architecture 🔧

### Keep Using Cloudflare For:
- ✅ API endpoints (already working)
- ✅ Credential storage (already working)
- ✅ Webhook endpoints (if needed)
- ✅ Data processing

### Add Free Bot Hosting:

## Option 1: Railway + Cloudflare (Recommended)

```
┌─────────────────┐      ┌─────────────────┐
│  Discord Bot    │      │ Cloudflare API  │
│  (Railway.app)  │─────▶│  (Credentials)  │
└─────────────────┘      └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│   GitHub Repo   │◀─────│  GitHub Actions │
│  (Data Storage) │      │ (Daily Updates) │
└─────────────────┘      └─────────────────┘
```

### Setup Steps:
1. **Keep Cloudflare Worker** for API/credentials
2. **Deploy bot to Railway**:
   ```bash
   # At railway.app:
   1. Connect GitHub repo
   2. Set root directory: /bot
   3. Add environment variables:
      DISCORD_BOT_TOKEN=your_new_token
      DISCORD_CLIENT_ID=1428908204712132752
      DISCORD_GUILD_ID=1415514542405976146
   4. Deploy!
   ```

---

## Option 2: Replit + Cloudflare (Free)

### Setup:
1. Go to [Replit.com](https://replit.com)
2. Import from GitHub → select BOMB repo
3. Configure run command: `cd bot && npm start`
4. Add secrets (environment variables)
5. Use UptimeRobot to keep alive

### Architecture:
```
Discord ←── Replit (Bot) ←── GitHub (Data)
                ↓
         Cloudflare (APIs)
```

---

## Option 3: Local + Cloudflare Tunnel (Advanced)

If you want to host on your computer but make it accessible:

### Setup:
1. Install Cloudflare Tunnel (cloudflared)
2. Run bot locally
3. Expose through Cloudflare Tunnel
4. Bot accessible 24/7 through Cloudflare

```bash
# Install cloudflared
# Create tunnel
cloudflared tunnel create discord-bot

# Run bot with tunnel
cloudflared tunnel run discord-bot
```

---

## Option 4: GitHub Actions + Webhooks (Limited)

Since Cloudflare Workers can handle webhooks, you could:

### Create Webhook-Based Commands:
1. Use Discord Interactions Endpoint URL
2. Point to Cloudflare Worker
3. Worker processes commands and responds

```javascript
// Cloudflare Worker for Discord Interactions
export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const interaction = await request.json();

      // Handle slash commands via webhook
      if (interaction.type === 2) { // Application Command
        return handleCommand(interaction);
      }
    }
  }
}
```

**Limitations:**
- No real-time features
- No voice support
- Complex to implement

---

## 🎯 Recommended Solution

### Use This Architecture:
1. **Railway/Replit**: Host the Discord bot (free tier)
2. **Cloudflare Worker**: Keep for API/credentials
3. **GitHub**: Code + data storage
4. **GitHub Actions**: Daily data updates

### Why This Works:
- ✅ Bot runs 24/7 (Railway/Replit)
- ✅ Secure credentials (Cloudflare)
- ✅ Automated updates (GitHub Actions)
- ✅ Free or very cheap
- ✅ Scalable

---

## Quick Start with Railway (5 minutes)

### Step 1: Get New Discord Token
```bash
# Go to Discord Developer Portal
# Reset token (old one is revoked)
# Copy new token
```

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Login with GitHub
3. New Project → Deploy from GitHub
4. Select `BOMB` repository
5. Set root directory: `/bot`
6. Add variables:
   ```
   DISCORD_BOT_TOKEN=your_new_token_here
   DISCORD_CLIENT_ID=1428908204712132752
   DISCORD_GUILD_ID=1415514542405976146
   ```
7. Deploy!

### Step 3: Verify
- Bot should be online in Discord
- Commands should work
- Data updates daily via GitHub Actions

---

## Environment Variables Setup

### For Railway/Replit:
```env
# Add these in hosting dashboard
DISCORD_BOT_TOKEN=your_new_token
DISCORD_CLIENT_ID=1428908204712132752
DISCORD_GUILD_ID=1415514542405976146
```

### For GitHub Secrets (already done):
```yaml
# Used by GitHub Actions for data collection
WORKER_API_URL=https://casa24-api.casa24records.workers.dev/api/credentials
DISCORD_BOT_TOKEN=your_new_token
```

### For Local Testing:
```env
# bot/.env.local (gitignored)
DISCORD_BOT_TOKEN=your_new_token
DISCORD_CLIENT_ID=1428908204712132752
DISCORD_GUILD_ID=1415514542405976146
```

---

## Summary

**Cloudflare Workers ≠ Discord Bot Hosting**

But you can use:
- **Cloudflare** → APIs, webhooks, edge functions
- **Railway/Replit** → Discord bot hosting
- **GitHub** → Code, data, automation

This gives you the best of all worlds! 🚀