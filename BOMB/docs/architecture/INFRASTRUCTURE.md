# 🏗️ Casa 24 Records - Infrastructure Guide

Complete guide to how your analytics infrastructure works.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS                          │
│  Runs daily at 2:30 AM UTC to collect analytics data        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE WORKER API                          │
│  Stores API credentials securely                            │
│  URL: https://casa24-api.casa24records.workers.dev          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│           PYTHON SCRIPT (collect_data.py)                   │
│  Fetches data from:                                         │
│  • Spotify API                                              │
│  • YouTube API                                              │
│  • Instagram API                                            │
│  • Discord API (optional - you have separate bot)          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA STORAGE                               │
│  • data/latest.json (current stats)                         │
│  • data/historical/*.json (daily snapshots)                 │
│  • data/popularity_scores.csv (historical CSV)              │
└─────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              DISCORD BOT (bot/)                             │
│  Reads from data/ directory                                 │
│  • /stats - Live analytics                                  │
│  • /growth - Growth trends                                  │
│  • /predict - AI predictions                                │
│  • /artist - Artist details                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Components

### 1. GitHub Actions Workflow

**File**: `.github/workflows/update-data.yml`

**Schedule**: Runs daily at 2:30 AM UTC
**Trigger**: Can also be triggered manually via GitHub Actions UI

**What it does**:
1. Checks out repository
2. Sets up Python 3.11
3. Installs dependencies from `requirements.txt`
4. Runs `scripts/collect_data.py`
5. Commits new data to `data/` directory
6. Pushes changes back to repository

**Environment Variables Required**:
- `WORKER_API_URL` (GitHub repository variable)
- `WORKER_API_KEY` (GitHub secret - optional)

**How to configure**:
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add repository variable: `WORKER_API_URL` = `https://casa24-api.casa24records.workers.dev`
3. (Optional) Add secret: `WORKER_API_KEY` if your worker requires authentication

### 2. Cloudflare Worker API

**Purpose**: Securely stores API credentials without exposing them in GitHub

**Endpoint**: `https://casa24-api.casa24records.workers.dev/api/credentials`

**Credentials it should provide**:
```json
{
  "SPOTIFY_CLIENT_ID": "your_spotify_client_id",
  "SPOTIFY_CLIENT_SECRET": "your_spotify_client_secret",
  "YOUTUBE_API_KEY": "your_youtube_api_key",
  "INSTAGRAM_ACCESS_TOKEN": "your_instagram_token",
  "INSTAGRAM_BUSINESS_ACCOUNT_ID": "your_instagram_business_id",
  "INSTAGRAM_API_VERSION": "v18.0",
  "DISCORD_BOT_TOKEN": "optional_for_automated_collection",
  "DISCORD_GUILD_ID": "optional_for_automated_collection"
}
```

**Note on Discord Credentials**:
- You have a **separate Discord bot** in `bot/` directory
- The automated data collection **does not need** Discord credentials
- If Discord credentials are missing, the script will skip Discord data collection (no error)

### 3. Data Collection Script

**File**: `scripts/collect_data.py`

**What it collects**:

**Spotify Data** (for each artist):
- Popularity score (0-100)
- Followers count
- Monthly listeners count (web scraping)
- Genres
- Top 5 tracks with popularity scores

**YouTube Data** (for each artist):
- Subscriber count
- Total views
- Video count
- Top 5 videos with view counts

**Instagram Data** (for each artist):
- Followers count
- Media count (posts)
- Username

**Discord Data** (optional):
- Server member count
- Online member count
- Server name

**Artists Tracked**:
1. Casa 24
2. Chef Lino
3. PYRO
4. bo.wlie
5. Mango Blade
6. ZACKO
7. ARANDA
8. Casa 24Beats

**Output Files**:
- `data/latest.json` - Current snapshot
- `data/historical/YYYY-MM-DD.json` - Daily historical snapshot
- `data/popularity_scores.csv` - CSV format (for compatibility)

### 4. Discord Bot

**Directory**: `bot/`

**Purpose**: Separate Discord bot for interactive analytics commands

**Reads from**: `../data/latest.json` and `../data/historical/*.json`

**Commands**: See `bot/README.md` for details

**Credentials**: Uses **separate Discord bot token** (not the same as automated collection)

**Setup**: See `bot/QUICKSTART.md`

## 🔐 Credentials Setup

### For Automated Data Collection (GitHub Actions)

**Step 1: Configure Cloudflare Worker**

Your Cloudflare Worker at `https://casa24-api.casa24records.workers.dev` should:
1. Have endpoint `/api/credentials` that returns JSON with API keys
2. Include Spotify, YouTube, and Instagram credentials
3. (Optional) Include Discord credentials - but not necessary if using separate bot

**Step 2: Configure GitHub**

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "Variables" tab → "New repository variable"
4. Add:
   - Name: `WORKER_API_URL`
   - Value: `https://casa24-api.casa24records.workers.dev`

**Step 3: Test the Workflow**

1. Go to Actions tab on GitHub
2. Select "Update Spotify Data" workflow
3. Click "Run workflow"
4. Check if it succeeds

### For Discord Bot (Separate)

**File**: `bot/.env`

Create `.env` file with:
```env
DISCORD_BOT_TOKEN=your_new_bot_token_here
DISCORD_CLIENT_ID=your_bot_client_id
DISCORD_GUILD_ID=1000913895415877712
```

**Note**: This is a **NEW Discord bot**, separate from any credentials in Cloudflare Worker.

See `bot/QUICKSTART.md` for complete setup.

## 📅 Data Update Schedule

**Automated Collection**:
- **Frequency**: Daily at 2:30 AM UTC
- **Method**: GitHub Actions workflow
- **Duration**: ~2-5 minutes per run
- **Storage**: Commits to `data/` directory

**Manual Trigger**:
- Go to GitHub Actions → "Update Spotify Data" → "Run workflow"
- Useful for testing or getting fresh data immediately

## 🔄 How Data Flows

1. **GitHub Actions triggers** at 2:30 AM UTC
2. **Fetches credentials** from Cloudflare Worker API
3. **Collects data** from Spotify, YouTube, Instagram (Discord optional)
4. **Saves to files**:
   - `data/latest.json` (overwrites)
   - `data/historical/2025-10-17.json` (new file each day)
   - `data/popularity_scores.csv` (appends)
5. **Commits & pushes** changes to repository
6. **Discord bot reads** updated data automatically (no restart needed)

## 🚨 Troubleshooting

### GitHub Action Fails

**Check**:
1. Workflow logs: Actions tab → Failed run → View logs
2. Cloudflare Worker is accessible: `curl https://casa24-api.casa24records.workers.dev/api/credentials`
3. GitHub variables: Settings → Secrets and variables → Check `WORKER_API_URL`

**Common Issues**:
- `WORKER_API_URL` not set in GitHub → Add it
- Cloudflare Worker down → Check worker status
- API credentials expired → Update in Cloudflare Worker
- Rate limiting → Script has delays, but may need adjustment

### Discord Bot Not Seeing New Data

**Check**:
1. Did GitHub Action succeed? Check Actions tab
2. Is `data/latest.json` updated? Check file timestamp
3. Bot reading from correct path? Should be `../data/latest.json`

**Fix**:
- Bot automatically reads latest data on each command
- No restart needed after data update
- If still issues, restart bot: Stop (`Ctrl+C`) and `npm start`

### Missing Artist Data

**Check**:
1. Artist IDs correct in `collect_data.py`?
2. Artist privacy settings (private profiles not accessible)
3. API credentials have correct permissions

## 📊 Data Structure

### latest.json Format

```json
{
  "date": "2025-10-17",
  "discord": {
    "member_count": 64,
    "online_count": 16,
    "server_name": "🏠Casa 24",
    "server_id": "1000913895415877712"
  },
  "artists": [
    {
      "name": "Casa 24",
      "spotify": {
        "popularity_score": 3,
        "followers": 523,
        "monthly_listeners": "976",
        "genres": [],
        "top_tracks": [...]
      },
      "youtube": {
        "subscribers": 623,
        "total_views": 29304,
        "video_count": 94,
        "top_videos": [...]
      },
      "instagram": {
        "followers": 1699,
        "media_count": 578,
        "username": "casa24records",
        "name": "Casa 24"
      }
    }
  ]
}
```

## 🔧 Maintenance

### Adding New Artists

Edit `scripts/collect_data.py`, add to `artists` list:

```python
{
    'name': 'New Artist Name',
    'spotify_id': 'spotify_artist_id_here',
    'youtube_id': 'youtube_channel_id_here',
    'instagram_username': 'instagram_username',
},
```

**How to get IDs**:
- **Spotify**: Open artist page → Share → Copy link → Extract ID from URL
- **YouTube**: Channel page → Channel ID in URL or About section
- **Instagram**: Just the username (without @)

### Updating API Credentials

**Update in Cloudflare Worker**:
1. Log into Cloudflare Dashboard
2. Workers & Pages → casa24-api
3. Edit environment variables or KV storage
4. Deploy changes

**Test**:
```bash
curl https://casa24-api.casa24records.workers.dev/api/credentials
```

Should return updated credentials.

## 📈 Data Retention

**Current Setup**:
- **Historical snapshots**: Kept indefinitely in `data/historical/`
- **Storage**: ~6KB per day = ~2.2MB per year
- **Git history**: All changes tracked

**Optimization** (if needed):
- Keep only last 90 days
- Archive old data to separate repository
- Compress historical JSON files

## 🔗 Related Documentation

- **Discord Bot Setup**: `bot/QUICKSTART.md`
- **Discord Bot Commands**: `bot/README.md`
- **Python Dependencies**: `requirements.txt`
- **GitHub Actions Workflow**: `.github/workflows/update-data.yml`

---

**🎵 Casa 24 Records Infrastructure**

*Built with 💚 by Casa 24 Records*
