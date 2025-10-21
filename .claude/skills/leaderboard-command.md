# Leaderboard Command Skill

## Purpose
The leaderboard command provides comprehensive artist rankings across multiple social media platforms and engagement metrics. It visualizes performance data with progress bars, medals for top performers, and growth trend indicators to help users compare artists at a glance.

## Command Name
`/leaderboard`

## Key Features
- **Multi-Metric Rankings**: Tracks 8 different performance metrics
  - Spotify Monthly Listeners
  - Spotify Followers
  - YouTube Subscribers
  - YouTube Total Views
  - Instagram Followers
  - Total Reach (aggregate across platforms)
  - Weekly Momentum Score
  - Engagement Score (listener-to-follower ratio)
- **Visual Progress Bars**: 20-character width bars for quick metric comparison
- **Medal System**: Awards gold/silver/bronze medals to top 3 performers
- **Growth Trends**: Displays 7-day growth percentages alongside current values
- **Tiered Display**: Top 3 artists shown in detail, remaining artists in condensed format
- **Engagement Scoring**: Calculated ratio showing listener engagement relative to follower base

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metric` | String Choice | No | Specific metric to rank by (defaults to total reach) |

### Metric Options:
- `spotify_listeners` - Monthly Spotify listeners
- `spotify_followers` - Spotify follower count
- `youtube_subs` - YouTube subscriber count
- `youtube_views` - Total YouTube video views
- `instagram_followers` - Instagram follower count
- `total_reach` - Combined reach across all platforms (default)
- `momentum` - Weekly momentum score (0-100)
- `engagement` - Engagement score (listener/follower ratio)

## Data Sources

### Primary Data Files
- **Artist Statistics Database**: Contains current and historical metrics
  - Spotify: Listeners, followers
  - YouTube: Subscribers, views
  - Instagram: Followers
- **Growth Trend Data**: 7-day historical snapshots for trend calculation
- **Artist Profile Data**: Names, profile images, platform links

### Data Requirements
- Minimum 7 days of historical data for accurate trend calculation
- Real-time or near-real-time metric updates for current values
- Artist metadata for display formatting

## Common Modifications

### Adjusting Progress Bar Width
```javascript
// Current: 20-character width
const BAR_WIDTH = 20;
// Modify to change visual bar length (10-30 recommended)
```

### Changing Medal Thresholds
```javascript
// Current: Top 3 get medals
const MEDAL_COUNT = 3;
const MEDALS = ['🥇', '🥈', '🥉'];
// Expand to top 5: Add '🏅', '🎖️'
```

### Modifying Growth Trend Period
```javascript
// Current: 7-day growth trends
const TREND_DAYS = 7;
// Change to 14 or 30 days for longer-term trends
```

### Adjusting Engagement Score Calculation
```javascript
// Current formula: listeners / followers
const engagementScore = (listeners / followers) * 100;
// Alternative: Add weight factors or include other metrics
const engagementScore = ((listeners * 0.6) + (views * 0.4)) / followers * 100;
```

### Changing Detailed vs Condensed Display Threshold
```javascript
// Current: Top 3 detailed, rest condensed
const DETAILED_COUNT = 3;
// Increase to show more detailed entries
```

### Color Scheme Customization
```javascript
// Embed colors for different ranks
const COLORS = {
  gold: 0xFFD700,    // Top rank
  silver: 0xC0C0C0,  // Second rank
  bronze: 0xCD7F32,  // Third rank
  default: 0x1DB954  // Spotify green for others
};
```

## Troubleshooting

### Issue: Progress bars showing incorrectly
**Symptoms**: Bars are empty, too full, or malformed
**Solutions**:
1. Check if maximum value calculation is correct for the metric
2. Verify data normalization (values should be 0-100% range)
3. Ensure Unicode bar characters are rendering properly
4. Check for division by zero in percentage calculations

**Debug Check**:
```javascript
console.log(`Max: ${maxValue}, Current: ${currentValue}, Percentage: ${percentage}`);
```

### Issue: Growth trends not displaying
**Symptoms**: Missing or zero growth percentages
**Solutions**:
1. Verify 7+ days of historical data exists for all artists
2. Check date range queries in database lookups
3. Ensure historical snapshots are being saved correctly
4. Validate growth calculation formula handles edge cases (new artists, zero values)

**Debug Check**:
```javascript
console.log(`Historical data points: ${historicalData.length}`);
console.log(`Current: ${current}, Previous: ${previous}, Growth: ${growth}%`);
```

### Issue: Engagement scores are unrealistic
**Symptoms**: Very high (>1000) or negative engagement scores
**Solutions**:
1. Check for proper handling of zero followers (avoid division by zero)
2. Verify listener count is monthly listeners, not lifetime
3. Add bounds checking (cap at reasonable maximum like 500%)
4. Ensure both metrics are from same time period

**Fix Example**:
```javascript
const engagementScore = followers > 0
  ? Math.min((listeners / followers) * 100, 500)  // Cap at 500%
  : 0;
```

### Issue: Medals not appearing for some users
**Symptoms**: Top 3 artists don't show medals
**Solutions**:
1. Check Discord client supports emoji rendering
2. Verify emoji codes are correct Unicode
3. Test with text-based indicators as fallback
4. Ensure ranking sort is working correctly

### Issue: Total reach calculation seems wrong
**Symptoms**: Total reach doesn't match sum of platforms
**Solutions**:
1. Verify all platform metrics are included in sum
2. Check for null/undefined values being added
3. Ensure no double-counting of metrics
4. Validate data types (string vs number)

**Calculation Check**:
```javascript
const totalReach =
  (spotifyListeners || 0) +
  (spotifyFollowers || 0) +
  (youtubeSubs || 0) +
  (instagramFollowers || 0);
console.log(`Total reach components: ${JSON.stringify({
  spotify: spotifyListeners + spotifyFollowers,
  youtube: youtubeSubs,
  instagram: instagramFollowers
})}`);
```

### Issue: Leaderboard shows outdated data
**Symptoms**: Metrics don't reflect recent changes
**Solutions**:
1. Check data update frequency/scheduling
2. Verify API calls are completing successfully
3. Clear any caching layers
4. Ensure database writes are committing properly
5. Check rate limits on social media APIs

### Issue: Command times out or runs slowly
**Symptoms**: Command doesn't respond or takes >3 seconds
**Solutions**:
1. Add database indexes on frequently queried fields
2. Implement pagination for large artist rosters
3. Cache leaderboard results with TTL (e.g., 5 minutes)
4. Optimize query to fetch only needed fields
5. Use defer() for Discord responses to extend timeout

**Performance Optimization**:
```javascript
// Add caching
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedLeaderboard = null;
let cacheTime = 0;

if (Date.now() - cacheTime < CACHE_TTL) {
  return cachedLeaderboard;
}
```

## Performance Considerations
- **Response Time Target**: < 2 seconds for typical roster (10-50 artists)
- **Data Freshness**: Balance between real-time accuracy and API rate limits
- **Database Queries**: Optimize with indexes on metric columns and timestamp fields
- **Embed Size Limits**: Discord embeds max at 6000 characters; consider pagination for large rosters

## Future Enhancement Ideas
- Add time period selector (24h, 7d, 30d rankings)
- Historical leaderboard comparisons ("who moved up?")
- Category-specific leaderboards (by genre, region, etc.)
- Export leaderboard as image/chart
- Personalized alerts when artist ranking changes significantly
