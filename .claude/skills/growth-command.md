# Growth Command Skill

## Purpose
Analyze and display growth trends for Casa 24 Records collective across multiple time periods and platforms.

## Command Name
`/growth`

## Key Features
- Configurable time periods (7, 14, 30, 60, 90 days)
- Platform-specific growth breakdowns
- Percentage change calculations with emoji indicators
- Top 3 growing artists leaderboard with medals
- Collective Casa 24 growth tracking
- Automatic emoji selection based on growth direction
- Requires minimum 2 days of historical data

## Parameters
- **period** (optional): Time period to analyze
  - Choices: 7 days, 14 days, 30 days, 60 days, 90 days
  - Default: 30 days
  - All choices are integer values

## Data Sources
- `data/latest.json` - Current artist metrics
- `data/historical/*.json` - Historical snapshots for period analysis

## Growth Analysis Sections

### Casa 24 Collective Growth
Tracks the main Casa 24 artist across:
- **Spotify Followers**: Total follower growth with percentage
- **Monthly Listeners**: Listener growth with percentage
- **YouTube Subscribers**: Subscriber growth with percentage
- **Instagram Followers**: Follower growth with percentage

### Top Growing Artists
- Ranked by monthly listener growth percentage
- Medal system: 🥇 1st, 🥈 2nd, 🥉 3rd
- Shows artist name and growth percentage
- Limited to top 3 performers

## Growth Calculation

### Platform Growth Function
Uses `calculatePlatformGrowth(historicalData, artistName, platform, metric)`:

Returns:
```javascript
{
  available: boolean,
  current: number,
  previous: number,
  growth: {
    absolute: number,
    percentage: number,
    emoji: string
  }
}
```

### Growth Emojis
- �� Positive growth
- 📉 Negative growth
- ➡️ No change

## Embed Styling
- Color: Casa 24 green (0x00a651)
- Title: "📈 Casa 24 Records - Growth Analysis"
- Description: "Analyzing {X} days of data ({period}-day period)"
- Footer: "Casa 24 Records - {X} days analyzed"
- Timestamp: Current time

## Common Modifications

### Adding New Growth Metrics
1. Calculate new metric using `calculatePlatformGrowth()`
2. Check if data is available
3. Format growth text with emoji and percentage
4. Add field to embed

### Modifying Time Periods
**Location**: Lines 9-19
- Add new choices to SlashCommandBuilder
- Update period options (currently 7, 14, 30, 60, 90)
- Must provide name and value for each choice

### Changing Top Artists Count
**Location**: Line 102
- Change `.slice(0, 3)` to show more/fewer artists
- Update medal array if showing more than 3

### Customizing Growth Display Format
**Location**: Lines 54-84
- Modify inline field layout
- Change emoji indicators
- Adjust percentage decimal places
- Add/remove metrics

## Artist Ranking Logic

```javascript
// Collect growth data for all artists
for (const artist of latestData.artists) {
  const growth = calculatePlatformGrowth(historicalData, artist.name, 'spotify', 'monthly_listeners');
  if (growth.available && growth.growth.percentage !== 0) {
    artistGrowthData.push({
      name: artist.name,
      percentage: growth.growth.percentage,
      absolute: growth.growth.absolute
    });
  }
}

// Sort by percentage growth (descending)
artistGrowthData.sort((a, b) => b.percentage - a.percentage);
```

## Utility Dependencies
- `loadLatestData()` - Current snapshot
- `loadHistoricalData(days)` - Historical data for period
- `calculatePlatformGrowth()` - Growth calculations
- `formatNumber(num)` - Number formatting with commas
- `formatPercent(percent)` - Percentage formatting with sign

## Troubleshooting

### Issue: "Not enough historical data"
**Cause**: Less than 2 days of data available
**Solution**:
- Wait for more data collection
- Check data collection automation (GitHub Actions)
- Verify historical data files exist

### Issue: Growth showing 0% despite changes
**Cause**:
- Previous data missing for artist
- Data collection gap
- Artist recently added
**Solution**: Check `growth.available` flag and historical data completeness

### Issue: Top growers list empty
**Cause**: No artists have growth data or all growth is 0%
**Solution**:
- Verify data collection is working
- Check if period is too short
- Ensure artists have baseline data

### Issue: Negative growth percentages
**Cause**: Artist losing followers (legitimate scenario)
**Solution**: System correctly shows negative growth with 📉 emoji

### Issue: Period selection not working
**Cause**: Invalid period value or data loading failure
**Solution**: Verify period choices match string values ('7', '14', etc.)

## Data Requirements

### Minimum Data Points
- **Required**: 2 days minimum
- **Recommended**: Full period + 1 day for accurate calculations
- **Optimal**: 90+ days for long-term trend analysis

### Historical Data Format
Each day should contain:
```json
{
  "date": "2025-MM-DD",
  "artists": [
    {
      "name": "Artist Name",
      "spotify": {
        "followers": 1234,
        "monthly_listeners": "5678"
      },
      "youtube": {
        "subscribers": 123
      },
      "instagram": {
        "followers": 456
      }
    }
  ]
}
```

## Performance Considerations
- Longer periods (90 days) require loading more data files
- Growth calculations are performed for each artist on each metric
- Consider caching results for frequently requested periods

## Optimization Tips
1. Cache growth calculations for recent periods
2. Precompute top growers daily
3. Add growth alerts for significant changes
4. Implement growth prediction based on trends
5. Add visual growth charts/graphs
6. Compare growth across different periods side-by-side

## Future Enhancements
- Growth velocity (acceleration/deceleration)
- Growth forecasting
- Anomaly detection (unusual spikes/drops)
- Growth comparison to label average
- Multi-period comparison view
- Growth milestones highlighting
- Export growth reports
- Scheduled growth summaries
- Growth alerts/notifications
- Platform-specific growth deep dives
