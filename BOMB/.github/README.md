# GitHub Workflows

## Canonical Workflow Location

The canonical GitHub Actions workflow for this project is located at:

```
../../.github/workflows/collect-data.yml
```

This workflow handles automated data collection for the BOMB (Band Operations Management Backend) system.

## Why No Workflows Here?

To avoid duplication and maintain a single source of truth, all GitHub Actions workflows are defined at the repository root level in `/.github/workflows/`.

The root workflow (`collect-data.yml`) is configured to:
- Run on a daily schedule (2:30 AM UTC)
- Support manual triggering via `workflow_dispatch`
- Install dependencies from `BOMB/scripts/requirements.txt`
- Execute data collection from `BOMB/scripts/collect_data.py`
- Commit changes to `BOMB/data/` directory

## Viewing the Workflow

To view or modify the workflow, see:
- File: `/.github/workflows/collect-data.yml`
- GitHub Actions UI: Navigate to the "Actions" tab in the repository

## Running the Workflow Manually

1. Go to the GitHub repository
2. Click on the "Actions" tab
3. Select "Collect Artist Analytics Data" from the workflows list
4. Click "Run workflow" button
5. Confirm the manual run

## Required Secrets

Configure these in GitHub repository settings under Settings > Secrets and variables > Actions:

### Secrets
- `WORKER_API_KEY` (optional): API key for Worker authentication
- `SPOTIFY_CLIENT_SECRET`: Spotify API credentials
- `YOUTUBE_API_KEY`: YouTube API credentials
- `INSTAGRAM_ACCESS_TOKEN`: Instagram API credentials
- `DISCORD_BOT_TOKEN`: Discord bot token

### Variables
- `WORKER_API_URL`: Worker API endpoint (default: https://casa24-api.casa24records.workers.dev)

For detailed environment variable documentation, see `docs/configuration/comprehensive-env-reference.md`.
