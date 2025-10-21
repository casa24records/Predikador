# Casa 24 Records Discord Bot

<div align="center">

![Discord Bot](https://img.shields.io/badge/Discord-Bot-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Real-time music analytics and AI-powered predictions for Casa 24 Records collective**

Track growth across Spotify, YouTube, and Instagram with intelligent forecasting powered by linear regression analysis.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Commands](#commands)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Data Updates](#data-updates)
- [Data Structure](#data-structure)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Casa 24 Records Discord Bot** is an analytics powerhouse that brings real-time music metrics directly to your Discord server. Track 8 artists across multiple platforms, analyze growth trends, and make AI-powered predictions about future performance—all through simple slash commands.

### Key Capabilities

- **Real-Time Stats**: Live metrics from Spotify, YouTube, and Instagram
- **Growth Analytics**: Historical trend analysis with customizable time periods
- **AI Predictions**: Linear regression forecasting for follower and listener counts
- **Artist Profiles**: Detailed breakdowns with top tracks, videos, and performance data
- **Automated Updates**: Daily data refresh via GitHub Actions

---

## Features

### Multi-Platform Tracking
Monitor performance across:
- **Spotify**: Followers, monthly listeners, popularity scores, top tracks
- **YouTube**: Subscribers, total views, video counts, top performing videos
- **Instagram**: Followers, media counts, engagement metrics
- **Discord**: Server member count and online status

### Intelligent Analytics
- **Growth Tracking**: Compare metrics over 7, 14, 30, 60, or 90-day periods
- **Top Performers**: Automatically identify fastest-growing artists
- **Visual Indicators**: Emoji-based trend indicators (📈 📉 ➡️)
- **Confidence Scores**: AI predictions include R-squared confidence metrics

### Artist Coverage
Tracks 8 Casa 24 Records artists:
1. Casa 24 (Main Collective)
2. Chef Lino
3. PYRO
4. bo.wlie
5. Mango Blade
6. ZACKO
7. ARANDA
8. Casa 24Beats

---

## Commands

### `/stats`
Display current collective-wide statistics and top performers.

**Example Output:**
```
📊 Casa 24 Records - Live Stats
Data as of 2025-10-15

🎵 Spotify
523 followers
978 monthly listeners

📺 YouTube
622 subscribers
29,300 total views

📸 Instagram
1,700 followers
8 artists tracked

🔥 Top Artists (Monthly Listeners)
🥇 Casa 24 - 978 listeners
🥈 Mango Blade - 513 listeners
🥉 Chef Lino - 290 listeners
```

### `/growth [period]`
Analyze growth trends over a specified time period.

**Parameters:**
- `period` (optional): `7`, `14`, `30`, `60`, or `90` days (default: 30)

**Example Output:**
```
📈 Casa 24 Records - Growth Analysis
Analyzing 30 days of data (30-day period)

🎵 Spotify Growth
📈 Followers: 523 (+5.2%)
📈 Monthly Listeners: 978 (+12.4%)

📺 YouTube Growth
📈 Subscribers: 622 (+3.8%)

📸 Instagram Growth
📈 Followers: 1,700 (+8.1%)

🚀 Top Growing Artists
🥇 Mango Blade - +15.3%
🥈 Casa 24 - +12.4%
🥉 Chef Lino - +8.7%
```

### `/predict [artist] [days]`
Generate AI predictions for future metrics using linear regression.

**Parameters:**
- `artist` (optional): Artist name (default: Casa 24)
- `days` (optional): Days ahead to predict, 7-90 (default: 30)

**Example Output:**
```
🔮 AI Prediction - Casa 24
Forecasting 30 days ahead using linear regression
Based on 90 days of historical data

🎵 Spotify Followers
Current: 523
Predicted: 548 (+4.8%)
Confidence: 87% ██████████░

🎧 Monthly Listeners
Current: 978
Predicted: 1,124 (+14.9%)
Confidence: 82% ████████░░░

⚠️ Disclaimer
Predictions use simple linear regression and assume current growth
trends continue. Actual results may vary based on releases,
marketing, and external factors.
```

### `/artist [name]`
Show detailed analytics for a specific artist with autocomplete.

**Parameters:**
- `name` (required): Artist name (supports autocomplete)

**Example Output:**
```
🎤 Casa 24
Detailed analytics for Casa 24

🎵 Spotify
Followers: 523
Monthly Listeners: 978
Popularity: 2/100

🔥 Top Tracks
1. Miradita Bob-Esponja (4/100)
2. Facil Relajado (4/100)
3. Lo Q Env Quiero (Real Shit) (4/100)
4. Japon (4/100)
5. Dinosaurios De Juguete (3/100)

📺 YouTube
Subscribers: 622
Total Views: 29,300
Videos: 94

📹 Top Videos
1. [chef lino.mp3](link) - 3,449 views
2. [IRRESISTIBLE (VIDEO OFICIAL)](link) - 3,442 views
3. [Llama Si Te Sientes Lonely](link) - 2,846 views

📸 Instagram
Followers: 1,700
Posts: 578
Username: @casa24records
```

---

## Prerequisites

Before installation, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Discord Bot Token** - [Create a bot](https://discord.com/developers/applications)
- **Discord Application ID** - From Discord Developer Portal
- **Git** - For cloning and version control

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/casa24records/discord-bot.git
cd discord-bot/bot
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `discord.js` (v14.14.1) - Discord API wrapper
- `dotenv` (v16.3.1) - Environment variable management
- `axios` (v1.6.2) - HTTP client for API requests

### 3. Create Environment File

```bash
cp .env.example .env
```

### 4. Configure Environment Variables

Edit `.env` with your credentials:

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here  # Optional: for guild-specific commands

# Data File Paths (relative to bot directory)
DATA_PATH=../data/latest.json
HISTORICAL_DATA_PATH=../data/historical
```

### 5. Deploy Slash Commands

Register commands with Discord:

```bash
node deploy-commands.js
```

**Note:** Global commands can take up to 1 hour to propagate. For instant testing, uncomment the guild-specific deployment in `deploy-commands.js`.

### 6. Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

---

## Configuration

### Getting Discord Credentials

1. **Create Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Name your application (e.g., "Casa 24 Analytics Bot")

2. **Get Client ID**
   - Navigate to "General Information"
   - Copy the "Application ID" (this is your `DISCORD_CLIENT_ID`)

3. **Create Bot User**
   - Go to "Bot" section
   - Click "Add Bot"
   - Under "Token", click "Reset Token" and copy it (this is your `DISCORD_BOT_TOKEN`)
   - **Important:** Never share your bot token publicly

4. **Set Permissions**
   - Enable "Presence Intent" and "Server Members Intent" if needed
   - Required permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`

5. **Invite Bot to Server**
   - Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
   - Copy the generated URL and open it to invite the bot

### Guild ID (Optional)

For faster command deployment during development:

```bash
# Enable Developer Mode in Discord
User Settings → Advanced → Developer Mode

# Right-click your server icon → Copy Server ID
```

---

## Data Updates

### Automated Daily Updates

The bot reads from JSON files updated daily by GitHub Actions at **2:30 AM UTC**.

**Workflow:** `.github/workflows/update-data.yml`

```yaml
schedule:
  - cron: '30 2 * * *'  # Daily at 2:30 AM UTC
```

**Process:**
1. Python script collects data from Spotify, YouTube, and Instagram APIs
2. Data saved to `data/latest.json` (current snapshot)
3. Historical snapshot saved to `data/historical/YYYY-MM-DD.json`
4. Changes automatically committed and pushed to repository
5. Bot reads updated data on next command invocation

### Manual Data Updates

Trigger workflow manually:

1. Go to repository Actions tab
2. Select "Update Spotify Data"
3. Click "Run workflow" → "Run workflow"

Or run locally:

```bash
cd scripts
python collect_data.py
```

### Data Collection Details

**Spotify Metrics:**
- Fetched via [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- Includes: followers, popularity, genres, top tracks
- Monthly listeners scraped from public artist pages

**YouTube Metrics:**
- Fetched via [YouTube Data API v3](https://developers.google.com/youtube/v3)
- Includes: subscribers, views, video count, top videos

**Instagram Metrics:**
- Collected via web scraping (public profiles)
- Includes: followers, media count, username

---

## Data Structure

### Latest Data (`data/latest.json`)

```json
{
  "date": "2025-10-15",
  "discord": {
    "member_count": 64,
    "online_count": 18,
    "server_name": "🏠Casa 24",
    "server_id": "1000913895415877712"
  },
  "artists": [
    {
      "name": "Casa 24",
      "spotify": {
        "popularity_score": 2,
        "followers": 523,
        "monthly_listeners": "978",
        "genres": [],
        "top_tracks": [
          {
            "name": "Miradita Bob-Esponja",
            "popularity": 4,
            "preview_url": null
          }
        ]
      },
      "youtube": {
        "subscribers": 622,
        "total_views": 29300,
        "video_count": 94,
        "top_videos": [
          {
            "title": "chef lino.mp3",
            "views": 3449,
            "video_id": "AL40f0Yftlg",
            "published_at": "2023-04-02T05:00:07Z"
          }
        ]
      },
      "instagram": {
        "followers": 1700,
        "media_count": 578,
        "username": "casa24records",
        "name": "Casa 24"
      }
    }
  ]
}
```

### Historical Data (`data/historical/YYYY-MM-DD.json`)

Identical structure to latest data, organized by date for time-series analysis.

**Example:**
- `2025-10-15.json`
- `2025-10-14.json`
- `2025-10-13.json`
- ...

Bot analytics functions load these files to calculate growth trends and predictions.

---

## Project Structure

```
bot/
├── commands/               # Slash command implementations
│   ├── stats.js           # /stats - Collective overview
│   ├── growth.js          # /growth - Trend analysis
│   ├── predict.js         # /predict - AI forecasting
│   └── artist.js          # /artist - Detailed profiles
├── utils/                 # Utility modules
│   ├── dataLoader.js      # JSON data loading functions
│   └── analytics.js       # Growth calculations and predictions
├── index.js               # Main bot entry point
├── deploy-commands.js     # Command registration script
├── package.json           # Dependencies and metadata
├── .env.example           # Environment template
└── .env                   # Your credentials (gitignored)

data/
├── latest.json            # Current artist metrics
└── historical/            # Time-series data archive
    ├── 2025-10-15.json
    ├── 2025-10-14.json
    └── ...

.github/
└── workflows/
    └── update-data.yml    # Automated data collection
```

---

## Deployment

### Running 24/7

For production deployment, use a process manager or hosting service:

#### Option 1: PM2 (Node.js Process Manager)

```bash
npm install -g pm2

# Start bot
pm2 start index.js --name casa24-bot

# Monitor
pm2 status
pm2 logs casa24-bot

# Auto-restart on crashes
pm2 startup
pm2 save
```

#### Option 2: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY bot/package*.json ./
RUN npm install --production

COPY bot/ ./
COPY data/ ../data/

CMD ["node", "index.js"]
```

```bash
docker build -t casa24-bot .
docker run -d --name casa24-bot --env-file bot/.env casa24-bot
```

#### Option 3: Cloud Hosting

Popular options:
- **Railway** - Simple deployment with GitHub integration
- **Render** - Free tier available
- **Heroku** - Worker dyno for bots
- **DigitalOcean App Platform** - Managed container hosting
- **AWS EC2** - Full control, requires more setup

### Environment Variables in Production

Never commit `.env` files. Set environment variables through your hosting provider's dashboard or CLI.

---

## Contributing

We welcome contributions! Here's how to get involved:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/casa24-bot.git
   cd casa24-bot
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add JSDoc comments for functions
   - Test commands thoroughly

4. **Test locally**
   ```bash
   npm run dev
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: New feature description"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **JavaScript**: ES6+ with async/await
- **Error Handling**: Always use try-catch blocks
- **Comments**: JSDoc for functions, inline for complex logic
- **Naming**: camelCase for variables, PascalCase for classes
- **Formatting**: 2-space indentation, single quotes

### Ideas for Contributions

- Add new slash commands (compare, leaderboard, alerts)
- Implement chart generation (trend graphs)
- Add support for more platforms (TikTok, SoundCloud)
- Improve prediction algorithms (polynomial regression, moving averages)
- Create admin commands (manual data refresh, configuration)
- Add localization support (multi-language embeds)
- Enhance error messages and help text
- Write unit tests for analytics functions

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Casa 24 Records

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](LICENSE) file for full details.

---

## Links & Resources

### Casa 24 Records
- **Spotify**: [Casa 24 Records](https://open.spotify.com/artist/2QpRYjtwNg9z6KwD4fhC5h)
- **YouTube**: [@casa24records](https://youtube.com/@casa24records)
- **Instagram**: [@casa24records](https://instagram.com/casa24records)
- **Discord**: [Join the Community](https://discord.gg/casa24)

### Documentation
- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [YouTube Data API](https://developers.google.com/youtube/v3)

### Support
- Report bugs: [GitHub Issues](https://github.com/casa24records/discord-bot/issues)
- Feature requests: [GitHub Discussions](https://github.com/casa24records/discord-bot/discussions)
- Questions: Join our Discord server

---

<div align="center">

**Built with 💚 by Casa 24 Records**

*"We Out Here"*
