# GitHub Secrets Configuration for Data Collection

## Overview

The data collection GitHub Actions workflow requires access to your Cloudflare Worker API to fetch credentials securely.

---

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### 1. **WORKER_API_URL** (Required)
- **Value**: `https://casa24-api.casa24records.workers.dev`
- **Description**: URL of your Cloudflare Worker that stores API credentials

### 2. **WORKER_API_KEY** (Optional but Recommended)
- **Value**: Your Cloudflare API authentication token
- **Description**: Authentication key for accessing the Worker API (if you've implemented authentication)

---

## How to Add Secrets to GitHub

### Step 1: Go to Repository Settings
1. Open your repository: https://github.com/casa24records/Predikador
2. Click **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**

### Step 2: Add Each Secret

Click **"New repository secret"** and add:

#### Secret 1: WORKER_API_URL
```
Name:  WORKER_API_URL
Value: https://casa24-api.casa24records.workers.dev
```

#### Secret 2: WORKER_API_KEY (if needed)
```
Name:  WORKER_API_KEY
Value: [your_cloudflare_api_token]
```

---

## Verify Your Cloudflare Worker

Your Cloudflare Worker should return credentials in this format:

```json
{
  "SPOTIFY_CLIENT_ID": "your_spotify_client_id",
  "SPOTIFY_CLIENT_SECRET": "your_spotify_client_secret",
  "YOUTUBE_API_KEY": "your_youtube_api_key",
  "INSTAGRAM_ACCESS_TOKEN": "your_instagram_token",
  "INSTAGRAM_BUSINESS_ACCOUNT_ID": "your_instagram_business_id",
  "INSTAGRAM_API_VERSION": "v18.0"
}
```

**Test your Worker**:
```bash
curl https://casa24-api.casa24records.workers.dev/api/credentials
```

---

## Workflow Schedule

The workflow runs:
- **Automatically**: Daily at 2:30 AM UTC
- **Manually**: Click "Run workflow" in the Actions tab

---

## Troubleshooting

### Issue: "Failed to fetch credentials from Worker"

**Check:**
1. Worker URL is correct in GitHub Secrets
2. Worker is deployed and accessible
3. Worker returns valid JSON with required fields

**Test locally:**
```bash
cd BOMB/scripts
export WORKER_API_URL="https://casa24-api.casa24records.workers.dev"
python collect_data.py
```

### Issue: "All data shows zeros"

**Possible causes:**
1. Spotify API credentials are invalid/expired
2. YouTube API key is invalid/expired
3. Instagram access token is invalid/expired
4. Rate limits hit on APIs

**Check Worker logs** to see which API calls are failing.

### Issue: "Workflow doesn't run"

**Check:**
1. GitHub Actions is enabled for your repository
2. Workflow file is in `.github/workflows/` directory
3. Workflow syntax is valid (check Actions tab for errors)

---

## Manual Workflow Trigger

To test the workflow immediately:

1. Go to: https://github.com/casa24records/Predikador/actions
2. Click **"Collect Artist Analytics Data"** workflow
3. Click **"Run workflow"** button
4. Select branch: **main**
5. Click **"Run workflow"**

Watch the logs to see if data collection succeeds!

---

## Expected Output

When successful, the workflow should:

1. ✅ Fetch credentials from Cloudflare Worker
2. ✅ Collect Spotify data (followers, monthly listeners, genres, top tracks)
3. ✅ Collect YouTube data (subscribers, views, top videos)
4. ✅ Collect Instagram data (followers, media count)
5. ✅ Save to `BOMB/data/latest.json`
6. ✅ Save to `BOMB/data/historical/YYYY-MM-DD.json`
7. ✅ Commit and push changes to repository

---

## Security Notes

- **Never commit API credentials** to the repository
- **Use GitHub Secrets** for sensitive values
- **Worker API** should validate requests to prevent abuse
- **Rotate credentials** regularly (every 90 days recommended)

---

## Next Steps

1. Add GitHub Secrets (WORKER_API_URL, WORKER_API_KEY)
2. Trigger workflow manually to test
3. Check if new data file is created in `BOMB/data/historical/`
4. Verify data has real numbers (not all zeros)
5. Wait for next scheduled run (2:30 AM UTC)

If data collection still shows zeros, check your Cloudflare Worker credentials!
