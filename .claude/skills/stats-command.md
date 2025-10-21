# Stats Command Skill

## Purpose
Display current Casa 24 Records collective analytics overview aggregating all artists across all platforms.

## Command Name
`/stats`

## Key Features
- Collective totals across all artists
- Platform-specific breakdowns (Spotify, YouTube, Instagram, Discord)
- Top 3 artists leaderboard by monthly listeners
- Medal system for top performers
- Casa 24 branded theming (green #00a651)
- No parameters required (instant overview)
- Real-time data display
- Artist count tracking

## Parameters
None - shows all collective stats automatically

## Data Sources
- `data/latest.json` - Current snapshot of all artist metrics

## Statistics Displayed

### Spotify Totals
- **Followers**: Sum of all artist followers
- **Monthly Listeners**: Sum of all artist monthly listeners

### YouTube Totals
- **Subscribers**: Sum of all artist subscribers
- **Total Views**: Sum of all artist video views

### Instagram Totals
- **Followers**: Sum of all artist followers
- **Artists Tracked**: Total count of artists in system

### Discord (Optional)
- **Members**: Total Discord server members
- **Online Now**: Current online member count

### Top Artists Leaderboard
- Top 3 artists ranked by monthly listeners
- Medal indicators: 🥇 Gold, 🥈 Silver, 🥉 Bronze
- Shows artist name and listener count

## Embed Styling
- **Color**: Casa 24 green (0x00a651)
- **Title**: "📊 Casa 24 Records - Live Stats"
- **Description**: "Data as of {date}"
- **Thumbnail**: Casa 24 logo (placeholder URL)
- **Footer**:
  - Text: "Casa 24 Records - We Out Here"
  - Icon: Casa 24 icon (placeholder URL)
- **Timestamp**: Current time

## Field Layout
Inline fields for compact display:
1. **Spotify** (inline: true)
2. **YouTube** (inline: true)
3. **Instagram** (inline: true)
4. **Discord** (inline: true) - if available
5. **Top Artists** (inline: false) - full width

## Aggregation Logic

```javascript
// Initialize totals
let totalSpotifyFollowers = 0;
let totalSpotifyListeners = 0;
let totalYouTubeSubscribers = 0;
let totalYouTubeViews = 0;
let totalInstagramFollowers = 0;

// Sum across all artists
data.artists?.forEach(artist => {
  totalSpotifyFollowers += artist.spotify?.followers || 0;
  totalSpotifyListeners += parseInt(artist.spotify?.monthly_listeners) || 0;
  totalYouTubeSubscribers += artist.youtube?.subscribers || 0;
  totalYouTubeViews += artist.youtube?.total_views || 0;
  totalInstagramFollowers += artist.instagram?.followers || 0;
});
```

## Top Artists Ranking

```javascript
const topArtists = data.artists
  ?.sort((a, b) => {
    const aListeners = parseInt(a.spotify?.monthly_listeners) || 0;
    const bListeners = parseInt(b.spotify?.monthly_listeners) || 0;
    return bListeners - aListeners; // Descending order
  })
  .slice(0, 3) // Top 3
  .map((artist, i) => {
    const medals = ['🥇', '🥈', '🥉'];
    const listeners = parseInt(artist.spotify?.monthly_listeners) || 0;
    return `${medals[i]} **${artist.name}** - ${formatNumber(listeners)} listeners`;
  })
  .join('\n');
```

## Common Modifications

### Changing Top Artists Count
**Location**: Line 73
- Change `.slice(0, 3)` to show more/fewer artists
- Update medals array if showing more than 3
- Consider pagination for large lists

### Adding New Platform Stats
1. Initialize total variable
2. Add forEach loop to sum values
3. Create embed field with platform stats
4. Update field inline/layout settings

Example - Adding TikTok:
```javascript
let totalTikTokFollowers = 0;

data.artists?.forEach(artist => {
  totalTikTokFollowers += artist.tiktok?.followers || 0;
});

embed.addFields({
  name: '🎵 TikTok',
  value: `**${formatNumber(totalTikTokFollowers)}** followers`,
  inline: true
});
```

### Modifying Brand Colors
**Location**: Line 39
- Change color hex (currently 0x00a651 - green)
- Use brand-specific colors for special events
- Seasonal color themes

### Updating Logo/Icons
**Location**: Lines 42, 93, 95
- Replace placeholder URLs with actual image URLs
- Ensure images are hosted reliably (Discord CDN, Imgur, etc.)
- Recommended sizes: Thumbnail 80x80, Icon 32x32

### Changing Ranking Criteria
**Location**: Lines 71-82
- Currently ranks by monthly listeners
- Can change to followers, total reach, engagement, etc.

Example - Rank by total followers:
```javascript
const topArtists = data.artists
  ?.sort((a, b) => {
    const aFollowers = (a.spotify?.followers || 0) +
                      (a.youtube?.subscribers || 0) +
                      (a.instagram?.followers || 0);
    const bFollowers = (b.spotify?.followers || 0) +
                      (b.youtube?.subscribers || 0) +
                      (b.instagram?.followers || 0);
    return bFollowers - aFollowers;
  })
```

## Data Format Expected

```json
{
  "date": "2025-10-21",
  "artists": [
    {
      "name": "Artist Name",
      "spotify": {
        "followers": 1234,
        "monthly_listeners": "5678"
      },
      "youtube": {
        "subscribers": 123,
        "total_views": 45678
      },
      "instagram": {
        "followers": 456
      }
    }
  ],
  "discord": {
    "member_count": 123,
    "online_count": 45
  }
}
```

## Utility Dependencies
- `loadLatestData()` - Current collective data
- `formatNumber(num)` - Number formatting with commas

## Troubleshooting

### Issue: Stats showing 0 for all platforms
**Cause**:
- Data loading failure
- Data file empty or corrupted
**Solution**:
- Check `data/latest.json` exists and has valid data
- Verify data collection script ran successfully

### Issue: Top artists list empty
**Cause**: No artists have monthly listeners data
**Solution**: Ensure Spotify data collection is working

### Issue: Discord stats not showing
**Cause**: Discord data not available in latest.json
**Solution**:
- Check if Discord integration enabled
- Verify Discord data collection working
- Field only shows if `data.discord` exists

### Issue: Monthly listeners showing "NaN"
**Cause**: String-to-number conversion failing
**Solution**: Ensure `parseInt()` handling at lines 26, 69, 74, 79

### Issue: Totals seem incorrect
**Cause**: Missing null/undefined checks
**Solution**: Verify `|| 0` fallback on all aggregations

## Performance Considerations
- Command executes quickly (no historical data needed)
- Aggregation is O(n) where n = number of artists
- Minimal API calls (single data file read)
- Can be cached for short periods (5-15 minutes)

## Optimization Tips
1. **Cache Results**: Cache for 10-15 minutes to reduce data reads
2. **Precompute Totals**: Store aggregated totals in data file
3. **Add Comparison**: Show change from yesterday/last week
4. **Visual Enhancements**: Add progress bars or charts
5. **Breakdown View**: Option to see per-artist contributions
6. **Historical Snapshot**: "Stats on this day last month"

## Future Enhancements
- Growth indicators (up/down arrows with percentages)
- All-time high markers
- Platform comparison (which platform growing fastest)
- Artist contribution percentages (e.g., "Artist X is 45% of total listeners")
- Milestone celebrations (reaching 10K, 100K, etc.)
- Monthly/yearly comparison stats
- Export stats as image/PDF
- Scheduled stats posts
- Stats history timeline
- Interactive stats dashboard link
- Real-time stats updates (WebSocket)
- Per-platform deep dives
- Geographic breakdowns
- Demographic insights
- Custom date range stats
