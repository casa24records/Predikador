# Quick Reference - Bulletproof Data Loading

## TL;DR - What You Need to Know

### It Just Works™
The data loading system automatically finds your data files whether you're running locally or on Railway, regardless of directory structure.

### Key Files
- **`copy-data.js`** - Copies data during `npm install`
- **`utils/dataLoader.js`** - Loads data at runtime

### What Happens Automatically

1. **During `npm install`:**
   - Searches 5 locations for data
   - Copies to `bot/data/`
   - Validates everything
   - Logs detailed progress

2. **When bot starts:**
   - Searches 7 locations for data
   - Loads from first found location
   - Validates JSON structure
   - Logs which path was used

## Console Output Quick Guide

### ✅ Success Indicators
```
✅ FOUND! File exists (4146 bytes)
✅ Successfully loaded data with 8 artists
✅ ALL CHECKS PASSED - DATA READY
```

### ❌ Error Indicators
```
❌ Does not exist
❌ CRITICAL ERROR: No data file found!
❌ ERROR READING DATA FILE
```

### ⚠️ Warning Indicators
```
⚠️ NO SOURCE DATA FOUND
⚠️ WARNING: No historical data found!
⚠️ Data file has unexpected structure
```

### 📦 Info Indicators
```
📦 BULLETPROOF DATA COPY SCRIPT
🔍 Searching for latest.json...
📖 Reading data from: /path/to/file
📚 Loading historical data from: /path/to/dir
📁 Copying directory: data
```

## Common Scenarios

### Local Development
```bash
cd BOMB/bot
npm install  # Copies data
npm start    # Loads data automatically
```

### Railway Deployment
1. Push to GitHub
2. Railway runs `npm install` (copies data)
3. Railway runs `npm start` (loads data)
4. ✅ Bot works!

### Debugging
Check Railway logs for:
1. Copy script output during build
2. Data loader output during startup
3. Look for ✅ or ❌ symbols

## Emergency Override

If nothing works, set environment variables in Railway:

```
DATA_PATH=/app/BOMB/data/latest.json
HISTORICAL_DATA_PATH=/app/BOMB/data/historical
```

These override all automatic path searching.

## File Locations Checked

### Copy Script (5 locations)
1. `../data`
2. `../../data`
3. `{cwd}/data`
4. `{cwd}/BOMB/data`
5. `{cwd}/../data`

### Data Loader (7 locations)
1. Environment variable
2. `../data/latest.json`
3. `../../data/latest.json`
4. `{cwd}/data/latest.json`
5. `{cwd}/BOMB/data/latest.json`
6. `{cwd}/bot/data/latest.json`
7. `{cwd}/../data/latest.json`

## Troubleshooting One-Liners

**"Where's my data?"**
→ Check Railway logs for copy script output

**"Copy failed during install"**
→ That's OK! Data loader will try original location

**"No data found at runtime"**
→ Check if source data is committed to git

**"Historical data not loading"**
→ Optional feature, bot works without it

**"Need custom path"**
→ Set DATA_PATH environment variable

## Documentation Files

- **`DATA_LOADING_GUIDE.md`** - Complete technical guide
- **`DEPLOYMENT_CHECKLIST.md`** - Deployment steps and verification
- **`IMPROVEMENTS_SUMMARY.md`** - What changed and why
- **`QUICK_REFERENCE.md`** - This file (quick answers)

## Testing Commands

```bash
# Test copy script
node copy-data.js

# Test data loader
node -e "const {loadLatestData} = require('./utils/dataLoader'); console.log(loadLatestData());"

# Check copied files
ls -la data/
ls -la data/historical/
```

## Key Features

✅ **5 source paths** tried during copy
✅ **7 runtime paths** tried during load
✅ **Detailed logging** with symbols (✅ ❌ ⚠️ 📦)
✅ **Never breaks build** - graceful failures
✅ **Data validation** - checks JSON structure
✅ **Environment override** - custom paths via env vars
✅ **Works everywhere** - local, Railway, any platform
✅ **Well documented** - 4 comprehensive guides

## When to Read Full Documentation

Read **`DATA_LOADING_GUIDE.md`** if:
- You want to understand how it works
- You're deploying for the first time
- You're debugging a path issue

Read **`DEPLOYMENT_CHECKLIST.md`** if:
- You're about to deploy
- Deployment failed
- You need to verify deployment

Read **`IMPROVEMENTS_SUMMARY.md`** if:
- You want to know what changed
- You're maintaining this code
- You need to explain it to someone

## The Bottom Line

**You don't need to think about data paths anymore.**

The system automatically finds your data whether you're running:
- On your laptop from any directory
- On Railway with any deployment structure
- In a Docker container
- On any other platform

**It just works.** And if it doesn't, the logs tell you exactly why.
