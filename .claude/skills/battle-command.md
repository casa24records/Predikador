# Battle Command Skill

## Purpose
Epic head-to-head artist comparison across multiple metrics with winner declaration and dynamic competitive messaging.

## Command Name
`/battle`

## Key Features
- Compares two artists across 6 battle metrics
- Platform filtering (all platforms, Spotify only, YouTube only, Instagram only)
- Dynamic victory messaging based on performance gap
- Percentage difference calculations for each metric
- Declares overall winner based on accumulated wins
- Tie detection and handling
- Color-coded embeds based on winner
- Autocomplete for both artist selections

## Parameters
- **artist1** (required): First artist to compare
  - Autocomplete enabled
- **artist2** (required): Second artist to compare
  - Autocomplete enabled
- **platform** (optional): Focus on specific platform
  - Choices: All Platforms, Spotify Only, YouTube Only, Instagram Only
  - Default: All Platforms

## Battle Metrics

### All Platforms (6 metrics)
1. **Spotify Followers**: Total Spotify followers
2. **Spotify Monthly Listeners**: Current monthly listeners
3. **YouTube Subscribers**: Total YouTube subscribers
4. **YouTube Total Views**: Cumulative video views
5. **Instagram Followers**: Total Instagram followers
6. **Overall Winner**: Artist with most metric wins

### Platform-Specific Battles
- **Spotify Only**: Followers + Monthly Listeners (2 metrics)
- **YouTube Only**: Subscribers + Total Views (2 metrics)
- **Instagram Only**: Followers (1 metric)

## Victory Levels

### Dynamic Messaging
Based on percentage difference:
- **WINS**: Standard victory (0-1000%)
- **DOMINATES**: Strong performance (listeners/followers context)
- **CRUSHES**: Large margin (1000%+)
- **OBLITERATES**: Massive dominance (5000%+ on views)
- **COMPLETELY DOMINATES**: Perfect shutout (opponent has 0 wins)

## Data Sources
- `data/latest.json` - Current artist metrics for both competitors

## Battle Result Tracking

```javascript
battleResults = {
  artist1: { wins: 0, metrics: [] },
  artist2: { wins: 0, metrics: [] },
  ties: 0
}
```

## Embed Styling
- **Title**: "⚔️ ARTIST BATTLE ⚔️"
- **Description**: "{Artist1} VS {Artist2}"
- **Color**:
  - Red (0xFF0000) if artist1 wins
  - Blue (0x0000FF) if artist2 wins
  - Yellow (0xFFFF00) if tie
- **Footer**: Platform filter info + suggestion to use /leaderboard

## Common Modifications

### Adding New Battle Metrics
1. Add metric comparison logic (lines 77-163)
2. Calculate values for both artists
3. Determine winner and add to battleResults
4. Format battle result text with emoji and stats
5. Update metric count for tie detection

### Modifying Victory Thresholds
**Location**: Lines 122, 138, 173-178
- **CRUSHES**: Change `> 1000` to different percentage
- **OBLITERATES**: Change `> 5000` to different percentage
- **DOMINATES**: Customize listener/follower context messaging

### Adjusting Percentage Display
**Location**: Lines 87, 90, 103, 107, 122, 126
- Show/hide percentage differences
- Change decimal precision (currently `.toFixed(0)`)
- Handle infinity cases when denominator is 0

### Custom Platform Filters
Add new platform choices:
1. Add choice to SlashCommandBuilder (lines 18-26)
2. Add battle metric calculations for new platform
3. Update footer text to reflect platform

## Comparison Logic

### Winner Determination
```javascript
if (value1 > value2) {
  battleResults.artist1.wins++;
  // Display victory message
} else if (value2 > value1) {
  battleResults.artist2.wins++;
  // Display victory message
} else {
  battleResults.ties++;
  // Display tie message
}
```

### Percentage Calculation
```javascript
const diff = ((value1 - value2) / value2 * 100).toFixed(0);
```
Handles division by zero with infinity check.

## Troubleshooting

### Issue: Artists cannot battle themselves
**Cause**: Same artist selected for both parameters
**Solution**: Validation check at line 66-68 prevents self-battles

### Issue: Percentages showing "∞"
**Cause**: Division by zero when comparing to artist with 0 value
**Solution**: Implemented at lines 102, 106, 122 - displays "∞" for infinity cases

### Issue: Tie when metrics should differ
**Cause**: Both artists have exactly same values
**Solution**: Working as intended - system correctly identifies ties

### Issue: Platform filter not working
**Cause**: Platform parameter not properly passed
**Solution**: Check platform filtering logic (lines 80, 115, 149)

### Issue: Autocomplete shows same artist twice
**Cause**: Duplicate entries in data or caching issue
**Solution**: Verify data source has unique artist names

## Embed Field Structure
```
🥊 Battle Results
├─ Metric 1 result
├─ Metric 2 result
├─ Metric 3 result
...

🏆 FINAL SCORE
├─ Artist1: X wins
├─ Artist2: Y wins
├─ Ties: Z
└─ Victory message
```

## Victory Message Examples
- "Artist1 COMPLETELY DOMINATES Artist2!" (shutout)
- "Artist1 defeats Artist2!" (normal win)
- "It's a TIE! Both artists are equally matched!" (tie)

## Optimization Tips
1. Cache frequently compared artist pairs
2. Add head-to-head history tracking
3. Implement battle leaderboard (most wins across all battles)
4. Add visual charts for metric comparison
5. Track closest battles (near-tie scenarios)
6. Add "rematch" button for repeated comparisons

## Future Enhancements
- Battle history between specific artists
- Time-based battles (compare growth over periods)
- Multi-artist battle royale mode
- Custom metric selection
- Battle predictions based on momentum
- Tournament bracket system
- Battle statistics (win rates, favorite matchups)
- Share battle results to social media
- Animated battle sequences
- Victory streak tracking
