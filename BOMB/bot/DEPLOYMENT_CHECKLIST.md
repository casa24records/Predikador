# Railway Deployment Checklist

## Pre-Deployment Checks

- [ ] Data files exist in `BOMB/data/` directory
- [ ] `latest.json` contains valid JSON
- [ ] `historical/` directory contains historical JSON files
- [ ] `.env` file has `DISCORD_TOKEN` set
- [ ] `package.json` has `postinstall: "node copy-data.js || true"`

## What Happens During Deployment

### 1. Railway runs `npm install`
This triggers the `postinstall` script automatically.

### 2. Copy Data Script Runs
The script will:
- Print current directory and process CWD
- Search 5 possible locations for source data
- Copy all data files to `bot/data/`
- Validate the copied data
- Print detailed logs

### 3. Bot Starts
When the bot runs:
- Data loader searches 7 possible locations
- Prints which paths are being tested
- Loads data from first found location
- Validates JSON structure

## Expected Console Output

### During npm install:
```
========================================
📦 BULLETPROOF DATA COPY SCRIPT
========================================
Current directory: /app/BOMB/bot
Process CWD: /app/BOMB/bot

🔍 Searching for source data...
   1. Testing: /app/BOMB/data
   ✅ FOUND! This location contains data files

📋 COPY OPERATION STARTING
   ✓ Copied: latest.json (4146 bytes)
   ✓ Copied: 171 historical files

✅ ALL CHECKS PASSED - DATA READY
```

### During bot startup:
```
========================================
🔍 Searching for latest.json...
========================================
   1. Testing: /app/BOMB/bot/data/latest.json
   ✅ FOUND! File exists (4146 bytes)
📖 Reading data from: /app/BOMB/bot/data/latest.json
✅ Successfully loaded data with 8 artists
```

## Troubleshooting

### Problem: "No source data found"
**What to check:**
1. Does `BOMB/data/latest.json` exist in your repository?
2. Is the data directory committed to git?
3. Check Railway's file browser to see what was deployed

**Solution:**
- Ensure data files are committed and pushed
- Check `.gitignore` doesn't exclude data files
- Verify Railway deployed the entire repository

### Problem: "No data file found" at runtime
**What to check:**
1. Did copy-data.js run successfully during install?
2. Check Railway logs for copy script output
3. Look for data in `/app/BOMB/bot/data/`

**Solution:**
- Check Railway build logs for copy script output
- Verify `postinstall` script ran
- Add `DATA_PATH` environment variable as fallback

### Problem: Historical data not loading
**What to check:**
1. Does `BOMB/data/historical/` directory exist?
2. Are there `.json` files in the historical directory?
3. Check Railway logs for historical data loading output

**Solution:**
- Ensure historical directory is committed
- Verify JSON files are valid
- Historical data is optional - bot works without it

## Manual Testing Locally

Before deploying, test locally:

```bash
# 1. Clean any existing copied data
rm -rf BOMB/bot/data

# 2. Run the copy script
cd BOMB/bot
node copy-data.js

# 3. Verify output shows data was found and copied
# You should see "✅ ALL CHECKS PASSED - DATA READY"

# 4. Test the bot
npm start
```

## Environment Variables (Railway)

Required:
- `DISCORD_TOKEN` - Your Discord bot token

Optional:
- `DATA_PATH` - Override data file location
- `HISTORICAL_DATA_PATH` - Override historical data location

## Deployment Scenarios Railway Handles

### Scenario 1: Deploy from root
```
Repository structure:
/
├── BOMB/
│   ├── data/          ← Source
│   └── bot/
│       └── data/      ← Destination

Railway sees: /app/BOMB/bot/
Copy finds: ../data (BOMB/data)
```

### Scenario 2: Deploy from BOMB/bot
```
Repository structure (Railway's view):
/
├── data/              ← Source (BOMB/data)
└── bot/
    └── data/          ← Destination

Railway sees: /app/
Copy finds: ../../data or process.cwd()/data
```

### Scenario 3: Any other structure
The script tries 5 different paths - it WILL find your data!

## Verification Commands (Railway Console)

```bash
# Check if data was copied
ls -la data/

# Check latest.json
cat data/latest.json

# Check historical files
ls -la data/historical/ | wc -l

# Test data loader
node -e "const {loadLatestData} = require('./utils/dataLoader'); console.log(loadLatestData());"
```

## Success Indicators

✅ Copy script shows "ALL CHECKS PASSED"
✅ Bot logs show "Successfully loaded data with X artists"
✅ Bot responds to Discord commands
✅ No errors in Railway logs

## If All Else Fails

Set environment variables to hardcode paths:
```
DATA_PATH=/app/BOMB/data/latest.json
HISTORICAL_DATA_PATH=/app/BOMB/data/historical
```

The data loader checks environment variables FIRST before trying any other path.
