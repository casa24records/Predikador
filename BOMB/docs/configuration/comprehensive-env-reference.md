# Comprehensive Environment Variables Reference

This document provides a complete reference for all environment variables used in the BOMB (Band Operations Management Backend) system.

## Table of Contents
- [Core Configuration](#core-configuration)
- [API Configuration](#api-configuration)
- [Spotify Integration](#spotify-integration)
- [YouTube Integration](#youtube-integration)
- [Instagram Integration](#instagram-integration)
- [Discord Integration](#discord-integration)
- [Development & Debugging](#development--debugging)

---

## Core Configuration

### WORKER_API_URL
- **Description**: URL endpoint for the Cloudflare Worker API
- **Required**: No
- **Default**: `https://casa24-api.casa24records.workers.dev`
- **Example**: `WORKER_API_URL=https://casa24-api.casa24records.workers.dev`
- **Notes**: Do not include a trailing slash

### WORKER_API_KEY
- **Description**: API key for authenticating with the Worker API
- **Required**: No (optional authentication)
- **Default**: Empty string
- **Example**: `WORKER_API_KEY=your_secure_api_key_here`
- **Notes**: Only required if you've implemented authentication on your Worker API

---

## API Configuration

### VERIFY_SSL
- **Description**: Enable/disable SSL certificate verification for API requests
- **Required**: No
- **Default**: `true`
- **Example**: `VERIFY_SSL=false`
- **Notes**: Set to `false` only in development environments with self-signed certificates

---

## Spotify Integration

### SPOTIFY_CLIENT_ID
- **Description**: Spotify application client ID
- **Required**: Yes (for Spotify data collection)
- **Default**: Empty string
- **Example**: `SPOTIFY_CLIENT_ID=abc123def456ghi789jkl012`
- **How to obtain**:
  1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
  2. Create or select your application
  3. Copy the Client ID from the application settings

### SPOTIFY_CLIENT_SECRET
- **Description**: Spotify application client secret
- **Required**: Yes (for Spotify data collection)
- **Default**: Empty string
- **Example**: `SPOTIFY_CLIENT_SECRET=xyz987wvu654tsr321qpo098`
- **How to obtain**:
  1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
  2. Create or select your application
  3. Click "Show Client Secret" in the application settings
- **Security**: Never commit this value to version control

---

## YouTube Integration

### YOUTUBE_API_KEY
- **Description**: Google API key with YouTube Data API v3 enabled
- **Required**: Yes (for YouTube data collection)
- **Default**: Empty string
- **Example**: `YOUTUBE_API_KEY=AIzaSyABC123DEF456GHI789JKL012MNO345PQR`
- **How to obtain**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable YouTube Data API v3
  4. Create credentials (API key)
  5. Restrict the API key to YouTube Data API v3
- **Security**: Never commit this value to version control

---

## Instagram Integration

### INSTAGRAM_ACCESS_TOKEN
- **Description**: Instagram Graph API access token
- **Required**: Yes (for Instagram data collection)
- **Default**: Empty string
- **Example**: `INSTAGRAM_ACCESS_TOKEN=IGQVJXabc123def456ghi789...`
- **How to obtain**:
  1. Set up a Facebook App with Instagram Basic Display or Instagram Graph API
  2. Complete the OAuth flow
  3. Obtain a long-lived access token
- **Notes**: Tokens expire and need to be refreshed periodically
- **Security**: Never commit this value to version control

### INSTAGRAM_BUSINESS_ACCOUNT_ID
- **Description**: Instagram Business Account ID
- **Required**: Yes (for Instagram data collection)
- **Default**: Empty string
- **Example**: `INSTAGRAM_BUSINESS_ACCOUNT_ID=17841401234567890`
- **How to obtain**:
  1. Convert Instagram account to Business account
  2. Link to a Facebook Page
  3. Use Graph API Explorer to get the account ID

### INSTAGRAM_API_VERSION
- **Description**: Instagram Graph API version to use
- **Required**: No
- **Default**: `v18.0`
- **Example**: `INSTAGRAM_API_VERSION=v19.0`
- **Notes**: Update to use newer API versions as they become available

---

## Discord Integration

### DISCORD_BOT_TOKEN
- **Description**: Discord bot authentication token
- **Required**: Yes (for Discord data collection)
- **Default**: Empty string
- **Example**: `DISCORD_BOT_TOKEN=MTAyMzQ1Njc4OTAxMjM0NTY3OC.AbCdEf.GhIjKlMnOpQrStUvWxYz123456`
- **How to obtain**:
  1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
  2. Create a new application or select existing
  3. Go to Bot section
  4. Click "Reset Token" to get the bot token
- **Security**: Never commit this value to version control

### DISCORD_GUILD_ID
- **Description**: Discord server (guild) ID to collect data from
- **Required**: Yes (for Discord data collection)
- **Default**: Empty string
- **Example**: `DISCORD_GUILD_ID=1023456789012345678`
- **How to obtain**:
  1. Enable Developer Mode in Discord (User Settings > Advanced)
  2. Right-click on the server icon
  3. Select "Copy Server ID"

---

## Development & Debugging

### DEBUG
- **Description**: Enable debug logging and verbose output
- **Required**: No
- **Default**: `false`
- **Example**: `DEBUG=true`
- **Notes**: Useful for troubleshooting data collection issues

---

## Example .env File

Create a `.env` file in your project root with the following template:

```bash
# Core Configuration
WORKER_API_URL=https://casa24-api.casa24records.workers.dev
WORKER_API_KEY=

# API Configuration
VERIFY_SSL=true

# Spotify Integration
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# YouTube Integration
YOUTUBE_API_KEY=

# Instagram Integration
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
INSTAGRAM_API_VERSION=v18.0

# Discord Integration
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=

# Development & Debugging
DEBUG=false
```

---

## Security Best Practices

1. **Never commit `.env` files**: Add `.env` to your `.gitignore`
2. **Use environment-specific files**: Create `.env.local`, `.env.production`, etc.
3. **Rotate secrets regularly**: Update API keys and tokens periodically
4. **Use GitHub Secrets**: For CI/CD workflows, store sensitive values in GitHub Secrets
5. **Limit token permissions**: Only grant the minimum required permissions
6. **Monitor token usage**: Set up alerts for unusual API activity

---

## GitHub Actions Configuration

When running in GitHub Actions, configure these as:
- **Secrets**: `SPOTIFY_CLIENT_SECRET`, `YOUTUBE_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `DISCORD_BOT_TOKEN`, `WORKER_API_KEY`
- **Variables**: `WORKER_API_URL`, `INSTAGRAM_API_VERSION`

See `.github/workflows/collect-data.yml` for implementation details.

---

## Troubleshooting

### Common Issues

**Missing API Keys**
- Symptom: Data collection fails with authentication errors
- Solution: Verify all required environment variables are set

**Expired Tokens**
- Symptom: Instagram or Spotify API calls fail with 401 errors
- Solution: Refresh access tokens using the respective OAuth flows

**SSL Certificate Errors**
- Symptom: HTTPS requests fail in development
- Solution: Set `VERIFY_SSL=false` (development only)

**Wrong API Version**
- Symptom: Instagram API calls fail with deprecated endpoint errors
- Solution: Update `INSTAGRAM_API_VERSION` to the latest stable version

---

## Additional Resources

- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

---

**Last Updated**: 2025-10-21
