# Achievements Command

## Purpose
Gamification system that tracks and displays artist achievements across multiple categories. Shows unlocked achievements with unlock dates and progress toward locked achievements with percentage completion.

## Command Name
`/achievements`

## Key Features
- **26 Total Achievements** across 5 categories
- **90-Day Historical Analysis** of artist growth data
- **Progress Tracking** for locked achievements showing completion percentage
- **Visual Indicators** with emojis for unlocked/locked status
- **Smart Threshold Calculations** for next milestone requirements
- **Achievement Unlock Timestamps** showing when milestones were reached

## Parameters

### Required Parameters
- `artist` (String, Autocomplete)
  - Description: Artist name to check achievements for
  - Uses autocomplete for existing artists in database
  - Flexible name matching (case-insensitive, handles variations)

## Achievement Categories

### 1. Growth Achievements (Follower Milestones)
- Rising Star (1K followers)
- Gaining Traction (5K followers)
- Breaking Through (10K followers)
- Established Artist (25K followers)
- Mainstream Success (50K followers)
- Superstar (100K followers)
- Megastar (500K followers)
- Global Icon (1M followers)

### 2. Viral Achievements (Single-Day Growth)
- Viral Moment (500+ followers in one day)
- Going Viral (1K+ followers in one day)
- Explosion (5K+ followers in one day)
- Phenomenon (10K+ followers in one day)

### 3. Consistency Achievements (Consecutive Growth Days)
- Consistent Growth (7 consecutive days)
- Momentum Builder (14 consecutive days)
- Unstoppable Force (30 consecutive days)

### 4. Collective Achievements (YouTube-Specific)
- Collective Support (1K YouTube subscribers)
- Collective Power (5K YouTube subscribers)
- Collective Force (10K YouTube subscribers)

### 5. Rare Achievements (Special Milestones)
- First 100 (Reach 100 followers)
- Trendsetter (100K+ Instagram followers)
- Content King (1M+ YouTube views)
- Chart Dominator (90+ Spotify popularity)
- Genre Pioneer (Featured in 5+ Spotify genres)
- Triple Threat (10K+ on all 3 platforms)
- Verified Maestro (10M+ monthly listeners)
- Living Legend (1M+ followers AND 1M+ monthly listeners)

## Data Sources

### Primary Data Files
- **Artist Database**: `C:\Users\14049\OneDrive\Documents\Website\BOT\claude\data\artists.json`
  - Current stats for all platforms
  - Artist metadata (name, genres, profile URLs)

### Historical Data
- **Daily Snapshots**: `C:\Users\14049\OneDrive\Documents\Website\BOT\claude\data\history\[YYYY-MM-DD].json`
  - 90 days of historical data analyzed
  - Tracks daily follower counts, monthly listeners, YouTube stats
  - Used to detect viral moments and growth streaks

### Data Structure Requirements
```json
{
  "spotify": {
    "followers": 12345,
    "monthlyListeners": 54321,
    "popularity": 85,
    "genres": ["genre1", "genre2"]
  },
  "youtube": {
    "subscribers": 6789,
    "totalViews": 1234567
  },
  "instagram": {
    "followers": 9876
  }
}
```

## Common Modifications

### Adjusting Achievement Thresholds

**Growth Achievements** (Line ~50-80):
```javascript
const growthAchievements = [
  { name: 'Rising Star', threshold: 1000, emoji: '🌟' },
  { name: 'Gaining Traction', threshold: 5000, emoji: '🚀' },
  // Modify threshold values to adjust difficulty
];
```

**Viral Achievements** (Line ~82-95):
```javascript
const viralAchievements = [
  { name: 'Viral Moment', threshold: 500, emoji: '💥' },
  // Adjust daily growth thresholds here
];
```

**Consistency Achievements** (Line ~97-110):
```javascript
const consistencyAchievements = [
  { name: 'Consistent Growth', days: 7, emoji: '📈' },
  // Modify consecutive day requirements
];
```

### Adding New Achievement Categories

1. Create achievement array in `checkAchievements()` function
2. Add checking logic function (e.g., `checkNewCategory()`)
3. Update embed to include new category section
4. Add progress calculation for locked achievements

### Modifying Historical Data Window

Change the 90-day lookback period (Line ~120):
```javascript
const daysToCheck = 90; // Modify to analyze different time periods
```

### Customizing Progress Display

Adjust progress bar visualization (Line ~200-220):
```javascript
const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
// Modify characters or length for different visual style
```

## Achievement Checking Functions

### `checkGrowthAchievements(stats)`
- Compares current Spotify followers against thresholds
- Returns unlocked growth milestones

### `checkViralMoments(history)`
- Analyzes day-over-day follower changes
- Detects single-day growth spikes
- Returns date of viral achievement unlock

### `checkConsistency(history)`
- Tracks consecutive days of positive growth
- Identifies longest growth streak
- Returns consistency achievement details

### `checkCollectiveAchievements(stats)`
- YouTube subscriber milestones
- Casa 24 collective-specific achievements

### `checkRareAchievements(stats)`
- Special cross-platform achievements
- Requires multiple criteria (e.g., Triple Threat)
- Genre-based achievements from Spotify data

## Troubleshooting

### Issue: "No achievements data available"
**Cause**: Missing historical data files
**Solution**:
- Verify `data/history/` directory contains JSON files
- Check that tracking script is running daily
- Minimum 1 day of data required, 90 days for full functionality

### Issue: Achievements not unlocking despite meeting criteria
**Cause**: Data sync lag or incorrect stats
**Solution**:
- Check `artists.json` has current stats
- Verify historical files have complete data (no null values)
- Run data validation: Look for missing fields in artist object

### Issue: Autocomplete not showing artists
**Cause**: Case sensitivity or artist not in database
**Solution**:
- Verify artist exists in `artists.json`
- Check artist has `name` field properly set
- Autocomplete is case-insensitive but requires exact name match

### Issue: Progress percentage incorrect
**Cause**: Edge case in calculation logic
**Solution**:
- Check for achievements with multiple thresholds
- Verify historical data completeness for streak-based achievements
- For rare achievements, ensure all required fields exist

### Issue: Unlock dates showing wrong timestamp
**Cause**: Historical data missing for actual unlock date
**Solution**:
- Achievement unlock date = first day threshold was met in history
- If historical data incomplete, shows earliest available date
- Add retroactive historical data if needed

## Performance Considerations

### Data Loading
- Loads 90 days of historical files (can be 90+ file reads)
- Consider caching history data for multiple commands
- Current approach: Load on demand per artist

### Optimization Opportunities
1. **Cache historical data**: Load once per bot session
2. **Index achievements**: Pre-calculate unlocks on data update
3. **Lazy loading**: Only load history if checking locked achievements
4. **Database migration**: Move to SQLite for faster queries

## Related Commands
- `/growth` - Shows growth trends that contribute to achievements
- `/artist` - Displays current stats used for achievement thresholds
- `/profile` - Alternative view of artist statistics

## Future Enhancement Ideas
- Achievement leaderboard showing all artists
- Notification system when new achievement unlocked
- Achievement point system with weighted values
- Seasonal/limited-time achievements
- Compare achievements between artists
- Export achievement history to image/PDF
