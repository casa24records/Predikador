# Bulletproof Data Loading System

This directory contains a robust, failure-resistant data loading system that works regardless of deployment structure on Railway or local development.

## Overview

The system consists of two main components:

1. **copy-data.js** - Intelligently copies data files during deployment
2. **utils/dataLoader.js** - Loads data with multiple fallback paths

## How It Works

### 1. Copy Script (`copy-data.js`)

The copy script runs during `npm install` (via `postinstall` hook) and:

- Searches **5 possible source locations** for data files
- Validates that the source contains actual data (checks for `latest.json`)
- Copies all data files to `bot/data/` directory
- Verifies the copied data integrity
- **Never fails the build** - exits gracefully if no data found

#### Possible Source Locations (in priority order):

1. `../data` - BOMB/data (when deployed from BOMB/bot)
2. `../../data` - data (when deployed from bot subdirectory)
3. `{process.cwd()}/data` - data (relative to process CWD)
4. `{process.cwd()}/BOMB/data` - BOMB/data (relative to process CWD)
5. `{process.cwd()}/../data` - ../data (relative to process CWD)

#### Features:

- Detailed console logging showing which paths are tested
- File-by-file copy progress with byte counts
- JSON validation to ensure data integrity
- Historical file count and date range display
- Graceful failure handling (won't break deployment)

### 2. Data Loader (`utils/dataLoader.js`)

The data loader provides four functions with intelligent fallback:

- `loadLatestData()` - Synchronous latest data loading
- `loadLatestDataAsync()` - Async latest data loading
- `loadHistoricalData(days)` - Synchronous historical data loading
- `loadHistoricalDataAsync(days)` - Async historical data loading

#### Possible Data Locations (in priority order):

1. **Environment variable** - `process.env.DATA_PATH` (highest priority)
2. **Bot directory** - `../data/latest.json` (Railway deployment)
3. **Parent directory** - `../../data/latest.json` (local development)
4. **Process CWD paths**:
   - `{process.cwd()}/data/latest.json`
   - `{process.cwd()}/BOMB/data/latest.json`
   - `{process.cwd()}/bot/data/latest.json`
5. **Relative paths** - `{process.cwd()}/../data/latest.json`

#### Features:

- Tests each location in order until data is found
- Clear console output showing which paths are tested
- File size and validation checks
- Historical data loads with individual file error handling
- Returns empty array on historical data failure (graceful degradation)
- Throws descriptive errors for latest data (critical)

## Console Output Examples

### Copy Script Output:

```
========================================
📦 BULLETPROOF DATA COPY SCRIPT
========================================
Current directory: /app/BOMB/bot
Process CWD: /app/BOMB/bot

🔍 Searching for source data in these locations (in order):
   1. /app/BOMB/data
   2. /app/data
   3. /app/BOMB/bot/data
   4. /app/BOMB/bot/BOMB/data
   5. /app/data

📍 Trying location 1: /app/BOMB/data
   ✅ FOUND! This location contains data files

========================================
📋 COPY OPERATION STARTING
========================================
Source:      /app/BOMB/data
Destination: /app/BOMB/bot/data

   📁 Copying directory: data
   ✓ Created destination: /app/BOMB/bot/data
   ✓ Copied: latest.json (4146 bytes)
   📊 Summary: 1 file(s), 1 subdirectory(ies)

========================================
✅ COPY COMPLETED SUCCESSFULLY
========================================

🔍 Verifying data integrity...
   ✅ latest.json found (4146 bytes)
   ✅ Valid JSON structure with 8 artists
   ✅ historical/ directory found with 171 JSON files
   📅 Date range: 2025-04-26.json to 2025-10-21.json

========================================
✅ ALL CHECKS PASSED - DATA READY
========================================
```

### Data Loader Output:

```
========================================
🔍 Searching for latest.json...
========================================
   1. Testing: /app/BOMB/bot/data/latest.json
   ✅ FOUND! File exists (4146 bytes)
========================================
📖 Reading data from: /app/BOMB/bot/data/latest.json
✅ Successfully loaded data with 8 artists
```

## Deployment Scenarios

### Scenario 1: Railway deploys from repository root

```
/app/
  ├── BOMB/
  │   ├── data/          ← Source data
  │   └── bot/
  │       ├── data/      ← Copied here
  │       └── index.js
```

**Result:** Copy script finds data at `../data`, copies to `bot/data/`

### Scenario 2: Railway deploys from BOMB/bot directory

```
/app/
  ├── data/              ← Source data (at BOMB level)
  └── bot/
      ├── data/          ← Copied here
      └── index.js
```

**Result:** Copy script finds data at `../../data`, copies to `data/`

### Scenario 3: Local development

```
Website/BOT/claude/
  ├── BOMB/
  │   ├── data/          ← Source data
  │   └── bot/
  │       ├── data/      ← Copied here (optional)
  │       └── index.js
```

**Result:** Data loader can access either `../data` or `../../data`

## Environment Variables (Optional)

You can override the default search paths using environment variables:

- `DATA_PATH` - Full path to `latest.json`
- `HISTORICAL_DATA_PATH` - Full path to historical directory

Example:
```bash
export DATA_PATH=/custom/path/to/latest.json
export HISTORICAL_DATA_PATH=/custom/path/to/historical
```

## Testing

Run the test script to verify the system works:

```bash
npm install  # This runs copy-data.js
node test-dataloader.js
```

## Error Handling

### Copy Script Errors:

- **No source data found**: Exits successfully with warning (won't break build)
- **Invalid JSON**: Exits successfully with warning
- **Copy failure**: Exits successfully with error message
- **All scenarios**: Never exits with error code 1 (won't fail npm install)

### Data Loader Errors:

- **Latest data not found**: Throws error with detailed path list
- **Invalid JSON**: Throws error with file path and parse error
- **Historical data not found**: Returns empty array, logs warning
- **Individual historical file errors**: Skips file, continues loading others

## Benefits

1. **Works Everywhere**: Local, Railway, or any other platform
2. **Clear Debugging**: Extensive logging shows exactly what's happening
3. **Graceful Degradation**: Historical data fails gracefully
4. **No Silent Failures**: All failures are logged clearly
5. **Build Safety**: Copy script never breaks deployment
6. **Multiple Fallbacks**: 5-7 different paths checked for each file

## Maintenance

When adding new data files:

1. Place them in `BOMB/data/` directory
2. Run `npm install` to test copy script
3. Run `node test-dataloader.js` to verify loading
4. Deploy - everything will work automatically

## Troubleshooting

If data loading fails, check the console output:

1. **Copy script output**: Shows which source was found and copied
2. **Data loader output**: Shows which paths were tested and found
3. **Error messages**: Include full path lists for debugging

The extensive logging makes it easy to diagnose any path-related issues.
