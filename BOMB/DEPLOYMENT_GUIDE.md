# 🚀 Casa 24 Records Bot - Complete Deployment Guide

## Overview
This guide covers all deployment options for the Casa 24 Records Discord Bot, from simple local deployment to full microservices architecture.

---

## 📋 Prerequisites

### Required
- Node.js 18+ (for bot)
- Python 3.11+ (for data collection)
- Git

### Optional (depending on deployment)
- Docker & Docker Compose
- GitHub account (for GitHub Actions)
- Cloud provider account (AWS/Azure/GCP)
- Redis (for caching)

---

## 🔑 Step 1: Credential Setup

### IMPORTANT: Discord Credentials Required
You need to get new Discord credentials since the old token was compromised.

1. **Get Discord Credentials:**
   ```
   1. Go to: https://discord.com/developers/applications
   2. Click "New Application" or select existing app
   3. Go to "Bot" section
   4. Click "Reset Token" and copy it immediately
   5. Go to "General Information" and copy Application ID
   ```

2. **Choose Credential Storage Method:**

   **Option A: Local .env file (Simple)**
   ```bash
   # Windows
   cd infrastructure\scripts
   setup-credentials.bat

   # Mac/Linux
   cd infrastructure/scripts
   chmod +x setup-credentials.sh
   ./setup-credentials.sh
   ```

   **Option B: Manual Setup**
   ```bash
   # Copy template
   cp .env.template .env

   # Edit with your credentials
   # Add your Discord token, client ID, and guild ID
   ```

---

## 🏃 Deployment Options

### Option 1: Simple Local Deployment (Quickest)

**Best for:** Testing, development, personal use

```bash
# 1. Install dependencies
cd bot
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your Discord credentials

# 3. Deploy commands to Discord
node deploy-commands.js

# 4. Start the bot
npm start
# Or use the convenience scripts:
# Windows: start.bat
# Mac/Linux: ./start.sh
```

**Pros:** Quick setup, full control
**Cons:** Only runs while your computer is on

---

### Option 2: Docker Deployment (Recommended)

**Best for:** Consistent environments, easy updates

```bash
# 1. Set up credentials
cp .env.template .env
# Edit .env with your credentials

# 2. Build and run with Docker Compose
cd infrastructure
docker-compose up -d

# 3. View logs
docker-compose logs -f discord-bot
```

**Services included:**
- Discord bot
- Redis cache
- Analytics service (optional)
- Prediction service (optional)

**Pros:** Isolated environment, easy to manage
**Cons:** Requires Docker knowledge

---

### Option 3: Cloud Deployment

#### 3a. Railway (Easiest Cloud Option)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add environment variables
railway variables set DISCORD_BOT_TOKEN=your_token
railway variables set DISCORD_CLIENT_ID=your_id
railway variables set DISCORD_GUILD_ID=your_guild

# 5. Deploy
railway up

# 6. View logs
railway logs
```

#### 3b. Render.com

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `cd bot && npm install`
4. Set start command: `cd bot && node index.js`
5. Add environment variables in dashboard
6. Deploy

#### 3c. Heroku

```bash
# 1. Install Heroku CLI and login
heroku login

# 2. Create app
heroku create casa24-bot

# 3. Set buildpack
heroku buildpacks:set heroku/nodejs

# 4. Add credentials
heroku config:set DISCORD_BOT_TOKEN=your_token
heroku config:set DISCORD_CLIENT_ID=your_id

# 5. Deploy
git push heroku main
```

---

### Option 4: Kubernetes Deployment (Advanced)

**Best for:** Production, high availability, auto-scaling

```bash
# 1. Create namespace
kubectl create namespace casa24

# 2. Create secrets
kubectl create secret generic discord-credentials \
  --from-literal=DISCORD_BOT_TOKEN=your_token \
  --from-literal=DISCORD_CLIENT_ID=your_id \
  --namespace=casa24

# 3. Deploy
kubectl apply -f infrastructure/k8s/ --namespace=casa24

# 4. Check status
kubectl get pods -n casa24

# 5. View logs
kubectl logs -f deployment/discord-bot -n casa24
```

---

## 📊 Data Collection Setup

The bot uses data collected daily via GitHub Actions.

### Verify GitHub Actions

1. **Check workflow:**
   ```bash
   cat .github/workflows/update-data.yml
   ```

2. **Add API credentials to GitHub Secrets:**
   ```
   Go to: https://github.com/YOUR_USERNAME/BOMB/settings/secrets/actions

   Add these secrets:
   - SPOTIFY_CLIENT_ID
   - SPOTIFY_CLIENT_SECRET
   - YOUTUBE_API_KEY
   - INSTAGRAM_ACCESS_TOKEN
   - WORKER_API_URL (if using Cloudflare)
   ```

3. **Test workflow:**
   ```
   Go to: Actions tab → update-data workflow → Run workflow
   ```

---

## 🧪 Testing Your Deployment

### 1. Test Bot Connection
```bash
# Create test script
cat > test-bot.js << 'EOF'
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ Bot connected as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    client.destroy();
});

client.login(process.env.DISCORD_BOT_TOKEN);
EOF

# Run test
node test-bot.js
```

### 2. Test Commands in Discord
```
1. Invite bot to your server
2. Type / in any channel
3. You should see bot commands appear
4. Try: /stats, /growth, /artist
```

### 3. Verify Data Loading
```bash
# Check latest data
cat data/latest.json | head -20

# Check historical data
ls data/historical/ | tail -5
```

---

## 🔄 Update & Maintenance

### Update Bot Code
```bash
# Pull latest changes
git pull origin main

# Rebuild if using Docker
docker-compose build
docker-compose up -d

# Or restart if running locally
# Ctrl+C to stop, then start again
```

### Update Dependencies
```bash
cd bot
npm update
npm audit fix
```

### Backup Data
```bash
# Backup historical data
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Or use provided script
./infrastructure/scripts/backup-data.sh
```

---

## 🐛 Troubleshooting

### Bot Not Coming Online

1. **Check token:**
   ```bash
   # Token might be revoked/invalid
   # Get new token from Discord Developer Portal
   ```

2. **Check logs:**
   ```bash
   # Local
   npm start

   # Docker
   docker-compose logs discord-bot

   # Railway
   railway logs
   ```

3. **Verify intents:**
   ```
   Discord Developer Portal → Bot → Privileged Gateway Intents
   Enable if needed: MESSAGE CONTENT INTENT
   ```

### Commands Not Showing

1. **Re-deploy commands:**
   ```bash
   cd bot
   node deploy-commands.js
   ```

2. **Wait and refresh:**
   - Commands can take 1-60 minutes to appear globally
   - Try Ctrl+R in Discord to refresh

3. **Check specific guild:**
   ```bash
   # Deploy to specific guild for instant updates
   # Edit deploy-commands.js to use guild-specific deployment
   ```

### Data Not Updating

1. **Check GitHub Actions:**
   ```
   GitHub → Actions tab → Check for failures
   ```

2. **Verify API credentials:**
   ```
   GitHub → Settings → Secrets → Verify all API keys set
   ```

3. **Run manually:**
   ```bash
   cd scripts
   python collect_data.py
   ```

---

## 📈 Monitoring

### Local Monitoring
```bash
# View real-time logs
tail -f bot.log

# Check process
ps aux | grep node

# Monitor resources
htop
```

### Docker Monitoring
```bash
# Container stats
docker stats

# Service health
docker-compose ps

# Logs
docker-compose logs -f --tail=100
```

### Cloud Monitoring

**Railway:**
```bash
railway logs --tail
```

**Kubernetes:**
```bash
kubectl top pods -n casa24
kubectl logs -f deployment/discord-bot -n casa24
```

---

## 🔐 Security Best Practices

1. **Never commit credentials:**
   - Use .env files locally (gitignored)
   - Use secrets management in production

2. **Rotate tokens regularly:**
   - Discord tokens if exposed
   - API keys every 90 days

3. **Use least privilege:**
   - Bot only needs required permissions
   - Don't grant Administrator unless necessary

4. **Monitor for anomalies:**
   - Unusual API usage
   - Unexpected data changes
   - High error rates

---

## 🚦 Production Checklist

- [ ] Discord token secured (not in code)
- [ ] Commands deployed to Discord
- [ ] Bot invited to server with correct permissions
- [ ] Data collection working (GitHub Actions)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Error alerting configured
- [ ] Documentation updated
- [ ] Team trained on deployment

---

## 📞 Support

### Documentation
- Architecture: `SCALABLE_ARCHITECTURE.md`
- Bot Commands: `bot/README.md`
- Infrastructure: `INFRASTRUCTURE.md`

### Common Issues
- Token Invalid: Regenerate in Discord Developer Portal
- Missing Intents: Enable in bot settings
- Rate Limited: Implement caching with Redis
- High Memory: Optimize data loading

### Getting Help
1. Check logs for specific errors
2. Review troubleshooting section
3. Check Discord.js documentation
4. Open issue on GitHub

---

## 🎯 Next Steps

After successful deployment:

1. **Optimize Performance:**
   - Enable Redis caching
   - Implement command cooldowns
   - Add monitoring metrics

2. **Add Features:**
   - Web dashboard
   - More ML predictions
   - Real-time notifications

3. **Scale Up:**
   - Multi-server support
   - Sharded bot for 2500+ servers
   - Regional deployments

---

**Your bot is ready for deployment!** Choose the option that best fits your needs and follow the steps above. Start with Option 1 (Simple Local) to test, then move to Option 2 (Docker) or Option 3 (Cloud) for production.