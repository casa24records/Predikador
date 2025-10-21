# 🎵 Casa 24 Records Discord Bot

An explosive Discord bot with 12+ commands bringing real-time analytics, gamification, AI predictions, viral detection, and achievement tracking for Casa 24 Records directly to your Discord server!

## 🚀 COMMAND OVERVIEW

### 📊 Analytics & Insights Commands

#### `/stats` - Live Analytics Dashboard
Real-time collective statistics across all platforms:
- **Spotify**: Followers, monthly listeners, top artists by popularity
- **YouTube**: Subscribers, total views, video counts
- **Instagram**: Followers, media counts
- **Discord**: Member count, online status
- Beautiful embedded messages with Casa 24 branding

#### `/growth [period]` - Growth Trend Analysis
Comprehensive growth analytics with customizable periods:
- **Time Periods**: 7, 14, 30, 60, or 90 days
- **Features**: Platform-specific growth percentages, top gainers, emoji indicators (📈📉➡️)
- **Insights**: Week-over-week comparisons, growth velocity tracking

#### `/momentum [artist] [period]` - Velocity & Acceleration Detector 🎯
Advanced growth momentum analysis to identify breakout moments:
- **Velocity Tracking**: Measures growth acceleration/deceleration
- **Breakout Detection**: Identifies when growth exceeds 2x standard deviation
- **Platform Analysis**: Spotify, YouTube, Instagram momentum scoring
- **Momentum Score**: 0-100 rating with recommendations

#### `/weekly [week_offset]` - Comprehensive Weekly Report 📊
Professional weekly performance digest:
- **Label Overview**: Total growth across all metrics
- **Artist Rankings**: 5-star rating system for each artist
- **Wins & Achievements**: Weekly highlights and milestones
- **Action Items**: Strategic recommendations for next week

### 🎮 Social & Gamification Commands

#### `/battle [artist1] [artist2] [platform]` - Epic Artist Battles ⚔️
Head-to-head artist comparisons with winner declaration:
- **Battle Metrics**: Followers, subscribers, monthly listeners, views
- **Platform Options**: All platforms or specific (Spotify/YouTube/Instagram)
- **Dynamic Scoring**: Win/loss tallying with percentage differences
- **Victory Messages**: "DOMINATES", "CRUSHES", "WINS" based on margins

#### `/leaderboard [metric]` - Dynamic Rankings 🏆
Real-time artist rankings with podium display:
- **Ranking Options**:
  - Spotify listeners/followers
  - YouTube subscribers/views
  - Instagram followers
  - Total reach (all platforms)
  - Weekly momentum (7-day growth)
  - Engagement score
- **Visual Elements**: Medal emojis (🥇🥈🥉), progress bars, growth indicators

#### `/spotlight` - Random Artist Showcase ✨
Randomly features an artist with engaging presentation:
- **Weighted Selection**: Artists with recent growth featured more
- **Dynamic Taglines**: "The Rising Star", "The Chart Climber", etc.
- **Call-to-Action**: Support links and engagement reactions
- **Hourly Rotation**: Fresh content throughout the day

### 🏆 Achievements & Milestones Commands

#### `/milestones [artist] [type]` - Milestone Tracker 🎯
Track progress toward platform milestones:
- **Milestone Tiers**: 100, 250, 500, 1K, 2.5K, 5K, 10K, 25K, 50K, 100K+
- **Progress Bars**: Visual representation with percentages
- **ETA Predictions**: AI-calculated achievement dates
- **Recently Achieved**: Celebrates crossed milestones

#### `/achievements [artist] [category]` - Achievement System 🏅
Unlock and track special accomplishments:
- **Achievement Categories**:
  - **Growth**: Rising Star, Lightning Growth, On Fire
  - **Viral**: Viral Video, Track Explosion, Wave Rider
  - **Consistency**: Week Warrior, Month Master, Steady Climber
  - **Collective**: Squad Goals, Platform Domination
  - **Rare**: Triple Crown, Diamond Status, Unicorn Moment
- **Progress Tracking**: Shows partial progress toward locked achievements
- **Rarity System**: Common to Legendary tier achievements

#### `/viral [timeframe]` - Viral Content Detector 🔥
Real-time viral moment detection and tracking:
- **Timeframes**: 24h, 7d, 30d, all-time analysis
- **Virality Score**: 0-100 rating based on growth velocity
- **Categories**: Active viral, cooling down, viral watch
- **Trigger Analysis**: Identifies what caused viral moments
- **Momentum Indicator**: EXPLOSIVE, HOT, WARMING, QUIET

### 🤖 AI & Prediction Commands

#### `/predict [artist] [days]` - AI Growth Forecasting 🔮
Machine learning predictions using 168+ days of historical data:
- **Linear Regression**: Advanced statistical modeling
- **Prediction Range**: 7-90 days ahead
- **Metrics**: Spotify followers/listeners, Instagram followers
- **Confidence Scores**: R-squared based accuracy ratings
- **Visual Progress Bars**: Shows confidence levels

#### `/artist [name]` - Deep Artist Analytics 🎤
Comprehensive individual artist profiles:
- **Spotify Data**: Followers, listeners, popularity, top 5 tracks
- **YouTube Metrics**: Subscribers, total views, top videos
- **Instagram Stats**: Followers, media count, username
- **Autocomplete**: Smart artist name suggestions
- **Genre Analysis**: Music style categorization

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Discord Bot Token** ([Create one here](https://discord.com/developers/applications))
- **Casa 24 data files** (already included in parent directory)

### Installation

1. **Navigate to the bot directory**:
   ```bash
   cd bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your bot**:
   Edit `.env` and add your Discord credentials:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=1000913895415877712
   ```

5. **Deploy slash commands**:
   ```bash
   node deploy-commands.js
   ```

6. **Start the bot**:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📖 Getting Discord Bot Credentials

### Step 1: Create Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Casa 24 Stats Bot" (or your preference)
4. Click "Create"

### Step 2: Create Bot User

1. In your application, go to "Bot" section
2. Click "Add Bot"
3. **Copy the Bot Token** → This is your `DISCORD_BOT_TOKEN`
4. Under "Privileged Gateway Intents", enable:
   - ✅ Server Members Intent (optional)
   - ✅ Message Content Intent (optional)

### Step 3: Get Client ID

1. Go to "OAuth2" → "General"
2. **Copy the Client ID** → This is your `DISCORD_CLIENT_ID`

### Step 4: Invite Bot to Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Use Slash Commands
4. Copy the generated URL
5. Open it in browser and invite bot to your server

### Step 5: Get Guild ID

1. Enable Developer Mode in Discord:
   - User Settings → Advanced → Developer Mode
2. Right-click your server → "Copy Server ID"
3. This is your `DISCORD_GUILD_ID`

## 🛠️ Command Examples

### Analytics Commands

#### `/stats`
**Usage**: `/stats`
**Description**: Displays current analytics for the entire collective

**Example Output**:
```
📊 Casa 24 Records - Live Stats
Data as of 2025-10-17

🎵 Spotify
523 followers
976 monthly listeners

📺 YouTube
623 subscribers
29,304 total views

📸 Instagram
1,699 followers
8 artists tracked

💬 Discord
64 members
16 online now

🔥 Top Artists (Monthly Listeners)
🥇 Casa 24 - 976 listeners
🥈 Mango Blade - 511 listeners
🥉 Chef Lino - 293 listeners
```

### `/growth [period]`
**Usage**: `/growth` or `/growth period:30`
**Parameters**:
- `period` (optional): Time period to analyze
  - `7` = Last 7 days
  - `14` = Last 14 days
  - `30` = Last 30 days (default)
  - `60` = Last 60 days
  - `90` = Last 90 days

**Example Output**:
```
📈 Casa 24 Records - Growth Analysis
Analyzing 30 days of data

🎵 Spotify Growth
📈 Followers: 523 (+15.2%)
📈 Monthly Listeners: 976 (+8.4%)

📺 YouTube Growth
➡️ Subscribers: 623 (+0.3%)

📸 Instagram Growth
📈 Followers: 1,699 (+8.1%)

🚀 Top Growing Artists
🥇 ARANDA - +45.6%
🥈 Casa 24 - +15.2%
🥉 Chef Lino - +12.1%
```

### `/predict [artist] [days]`
**Usage**: `/predict` or `/predict artist:Chef Lino days:60`
**Parameters**:
- `artist` (optional): Artist name (default: Casa 24)
- `days` (optional): Days ahead to predict, 7-90 (default: 30)

**Example Output**:
```
🔮 AI Prediction - Casa 24
Forecasting 30 days ahead using linear regression
Based on 90 days of historical data

🎵 Spotify Followers
Current: 523
Predicted: 612 (+17.0%)
Confidence: 87% ████████▓░

🎧 Monthly Listeners
Current: 976
Predicted: 1,104 (+13.1%)
Confidence: 72% ███████▓░░

⚠️ Disclaimer
Predictions use simple linear regression and assume current
growth trends continue. Actual results may vary based on
releases, marketing, and external factors.
```

### `/artist <name>`
**Usage**: `/artist name:Chef Lino`
**Parameters**:
- `name` (required): Artist name (supports autocomplete)

**Example Output**:
```
🎤 Chef Lino
Detailed analytics for Chef Lino

🎵 Spotify
Followers: 262
Monthly Listeners: 293
Popularity: 2/100
Genres: latin hip hop

🔥 Top Tracks
1. Facil Relajado (5/100)
2. Miradita Bob-Esponja (4/100)
3. Lo Q Env Quiero (Real Shit) (4/100)
4. Dinosaurios De Juguete (3/100)
5. Little Rascals (2/100)

📺 YouTube
Subscribers: 18
Total Views: 352
Videos: 6

📸 Instagram
Followers: 1,332
Posts: 5
Username: @chef_lino99
```

### Gamification Commands

#### `/battle [artist1] [artist2]`
**Usage**: `/battle artist1:"Casa 24" artist2:"Chef Lino" platform:all`

**Example Output**:
```
⚔️ ARTIST BATTLE ⚔️
Casa 24 VS Chef Lino

🎵 Spotify Followers: Casa 24 WINS! (523 vs 262) +99%
🎧 Monthly Listeners: Casa 24 DOMINATES! (978 vs 290) +237%
📺 YouTube Subscribers: Casa 24 CRUSHES! (622 vs 17) +3,559%
📸 Instagram Followers: Casa 24 WINS! (1,700 vs 1,331) +28%

🏆 FINAL SCORE
Casa 24: 4 wins
Chef Lino: 0 wins
Ties: 0

Casa 24 COMPLETELY DOMINATES Chef Lino!
```

#### `/leaderboard [metric]`
**Usage**: `/leaderboard metric:"spotify-listeners"`

**Example Output**:
```
🏆 CASA 24 LEADERBOARD
Category: Spotify Monthly Listeners

🥇 1. Casa 24
   ████████████████████ 978 listeners
   +15% this week 🔥

🥈 2. Mango Blade
   ██████████░░░░░░░░░░ 513 listeners
   +89% this week 🔥

🥉 3. Chef Lino
   █████░░░░░░░░░░░░░░░ 290 listeners
   +5% this week 📈
```

#### `/viral [timeframe]`
**Usage**: `/viral timeframe:7d`

**Example Output**:
```
🔥 VIRAL CONTENT TRACKER (Last 7 Days)

🚨 ACTIVE VIRAL MOMENTS
Casa 24Beats - YouTube
🔥🔥🔥 Virality Score: 87/100
👁️ 519 new views in 2 days
⚡ Velocity: 260 views/day
🎯 8.2x normal growth rate
💡 Trigger: New beat video gaining traction

Collective Momentum: 🔥 HOT | 1 viral moment detected
```

## 📁 Project Structure

```
bot/
├── commands/               # Slash command implementations
│   ├── stats.js           # /stats command
│   ├── growth.js          # /growth command
│   ├── predict.js         # /predict command (AI)
│   └── artist.js          # /artist command
├── utils/                 # Utility modules
│   ├── dataLoader.js      # Data loading functions
│   └── analytics.js       # Growth & prediction calculations
├── index.js               # Main bot file
├── deploy-commands.js     # Command deployment script
├── package.json           # Dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

## 🤖 How It Works

### Data Source
The bot reads from Casa 24's existing analytics infrastructure:
- **Latest data**: `../data/latest.json` (current stats)
- **Historical data**: `../data/historical/*.json` (90+ days of snapshots)

### Analytics Engine
- **Growth calculations**: Compare current vs. historical values
- **Predictions**: Linear regression on time-series data
- **Confidence scores**: R-squared statistical measure

### Discord Integration
- Uses Discord.js v14
- Slash commands for modern UX
- Autocomplete for artist selection
- Rich embeds with formatted data

## 🔧 Customization

### Adding New Commands

1. Create new file in `commands/` directory:
   ```javascript
   const { SlashCommandBuilder } = require('discord.js');

   module.exports = {
     data: new SlashCommandBuilder()
       .setName('mycommand')
       .setDescription('My custom command'),

     async execute(interaction) {
       await interaction.reply('Hello!');
     },
   };
   ```

2. Redeploy commands:
   ```bash
   node deploy-commands.js
   ```

3. Restart bot:
   ```bash
   npm start
   ```

### Changing Bot Activity

Edit `index.js`, line ~40:
```javascript
client.user.setActivity('Your Custom Status', { type: ActivityType.Watching });
```

Activity types: `Playing`, `Streaming`, `Listening`, `Watching`, `Competing`

### Adjusting Prediction Algorithm

Edit `utils/analytics.js`, `predictMetric()` function to:
- Use exponential smoothing
- Add seasonal decomposition
- Implement Prophet-style forecasting

## 🐛 Troubleshooting

### Bot not responding
- Check bot is online in Discord server members list
- Verify bot has "Send Messages" and "Use Slash Commands" permissions
- Check console for error messages

### Commands not appearing
- Wait up to 1 hour for global commands to propagate
- Or deploy to specific guild for instant testing (see `deploy-commands.js`)

### "Failed to load analytics data"
- Verify `../data/latest.json` exists and is valid JSON
- Check file paths in `.env` are correct
- Ensure bot process has read permissions

### Predictions showing "Not enough data"
- Need minimum 7 days of historical data
- Check `../data/historical/` directory has JSON files

## 📊 Data Update Schedule

The analytics data is automatically updated by Casa 24's GitHub Actions workflow:
- **Frequency**: Daily at 2:30 AM UTC
- **Data collected**: Spotify, YouTube, Instagram, Discord metrics
- **Bot picks up**: Latest changes automatically on next command

## 🤝 Contributing

Want to add features? Ideas:
- [ ] Add `/compare` command (artist vs. artist)
- [ ] Implement `/leaderboard` (top gainers/losers)
- [ ] Add `/release` impact tracking
- [ ] Create `/report` (weekly/monthly summaries)
- [ ] Build `/goals` (set growth targets)

## 📄 License

MIT License - Casa 24 Records

## 🎵 About Casa 24 Records

Casa 24 Records is a Panama City based music collective and record label rooted in rebellion, friendship, and creative freedom. We blend DIY spirit with boundary pushing artistry.

**Links**:
- Website: [casa24records.info](https://casa24records.info)
- Instagram: [@casa24records](https://instagram.com/casa24records)
- YouTube: [@casa24records](https://youtube.com/@casa24records)
- Discord: [Join our server](https://discord.gg/Cp7gtKwc6f)

---

**Made with 💚 by Casa 24 Records**

*"We Out Here"*
