# Milestones Command Skill

## Purpose
The milestones command tracks artist progress toward significant follower and listener thresholds across multiple platforms. It provides ETA predictions, motivational messaging, and celebrates recently achieved milestones to maintain momentum and engagement.

## Command Name
`/milestones`

## Key Features
- **13 Milestone Thresholds**: Tracks progress from 100 to 1,000,000
  - 100, 500, 1K, 5K, 10K, 25K, 50K, 100K, 250K, 500K, 750K, 1M
- **Multi-Platform Tracking**: Monitors 4 key metrics
  - Spotify Monthly Listeners
  - Spotify Followers
  - YouTube Subscribers
  - Instagram Followers
- **ETA Predictions**: Calculates estimated time to reach next milestone
  - Based on recent growth trends (7-30 day window)
  - Includes confidence scoring (high/medium/low)
  - Handles various growth patterns (linear, accelerating, stagnant)
- **Recently Achieved Milestones**: Celebrates milestones reached in last 30 days
- **Progress Visualization**: Progress bars showing completion percentage
- **Motivational Messaging**: Dynamic status messages based on progress
  - 90%+ progress: "Almost there!"
  - 75%+ progress: "Making great progress!"
  - 50%+ progress: "Halfway to the next milestone!"

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `artist` | String | Yes | Artist name or ID to check milestones for |
| `platform` | String Choice | No | Specific platform to focus on (shows all if not specified) |

### Platform Options:
- `spotify_listeners` - Spotify monthly listeners
- `spotify_followers` - Spotify followers
- `youtube` - YouTube subscribers
- `instagram` - Instagram followers
- `all` - All platforms (default)

## Data Sources

### Primary Data Files
- **Artist Metrics Database**: Current counts for all tracked platforms
- **Historical Growth Data**: 7-90 day historical snapshots for trend analysis
- **Milestone Achievement Log**: Records when milestones were reached
  - Timestamp of achievement
  - Metric type and value
  - Growth rate at time of achievement

### Data Requirements
- Minimum 7 days of historical data for basic ETA calculations
- 30 days recommended for accurate trend analysis
- Real-time metric updates for current progress
- Historical milestone log for "recently achieved" feature

## Common Modifications

### Adding New Milestone Thresholds
```javascript
// Current thresholds
const MILESTONES = [
  100, 500, 1000, 5000, 10000, 25000, 50000,
  100000, 250000, 500000, 750000, 1000000
];

// Add intermediate thresholds (e.g., 2K, 7.5K)
const MILESTONES = [
  100, 500, 1000, 2000, 5000, 7500, 10000,
  25000, 50000, 100000, 250000, 500000, 750000, 1000000
];

// Add higher thresholds for large artists
const MILESTONES = [...MILESTONES, 2000000, 5000000, 10000000];
```

### Adjusting ETA Calculation Window
```javascript
// Current: 30-day growth trend
const ETA_TREND_DAYS = 30;

// Shorter window for faster response to recent changes
const ETA_TREND_DAYS = 14;

// Longer window for more stable predictions
const ETA_TREND_DAYS = 60;
```

### Modifying Confidence Score Thresholds
```javascript
// Current confidence levels
const CONFIDENCE_THRESHOLDS = {
  high: 0.8,    // R-squared > 0.8
  medium: 0.5,  // R-squared 0.5-0.8
  low: 0.5      // R-squared < 0.5
};

// More conservative confidence scoring
const CONFIDENCE_THRESHOLDS = {
  high: 0.9,
  medium: 0.7,
  low: 0.7
};
```

### Changing "Recently Achieved" Time Window
```javascript
// Current: Last 30 days
const RECENT_MILESTONE_DAYS = 30;

// Last 7 days for weekly updates
const RECENT_MILESTONE_DAYS = 7;

// Last 90 days for quarterly reviews
const RECENT_MILESTONE_DAYS = 90;
```

### Customizing Motivational Messages
```javascript
// Current thresholds and messages
const MOTIVATIONAL_MESSAGES = [
  { threshold: 0.90, message: "🔥 Almost there! Just {remaining} to go!", emoji: "🎯" },
  { threshold: 0.75, message: "💪 Making great progress! {percent}% complete", emoji: "⭐" },
  { threshold: 0.50, message: "📈 Halfway to the next milestone!", emoji: "🚀" },
  { threshold: 0.25, message: "🌱 Keep growing! {remaining} until {milestone}", emoji: "🌟" },
  { threshold: 0, message: "🎬 Journey started toward {milestone}", emoji: "✨" }
];

// Add more granular messages
const MOTIVATIONAL_MESSAGES = [
  { threshold: 0.95, message: "🎉 SO CLOSE! Only {remaining} more!", emoji: "🔥" },
  { threshold: 0.90, message: "🎯 Almost there! Just {remaining} to go!", emoji: "💎" },
  // ... add more levels
];
```

### Adjusting Progress Bar Style
```javascript
// Current: 20-character width
const PROGRESS_BAR_WIDTH = 20;
const FILLED_CHAR = '█';
const EMPTY_CHAR = '░';

// Longer bar for more detail
const PROGRESS_BAR_WIDTH = 30;

// Different visual style
const FILLED_CHAR = '●';
const EMPTY_CHAR = '○';
```

### ETA Display Formatting
```javascript
// Current: "X days" or "Y weeks"
function formatETA(days) {
  if (days < 7) return `${days} days`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} years`;
}

// More precise formatting
function formatETA(days) {
  if (days < 1) return `${Math.round(days * 24)} hours`;
  if (days < 14) return `${days} days`;
  // ... more granular options
}
```

## Troubleshooting

### Issue: ETA predictions are wildly inaccurate
**Symptoms**: ETAs showing unrealistic timeframes (1000+ days or negative days)
**Solutions**:
1. Check if growth rate is calculated correctly (handle negative growth)
2. Verify sufficient historical data exists (minimum 7 days)
3. Add bounds checking for extreme predictions
4. Handle edge cases: zero growth, declining metrics
5. Implement weighted average for volatile growth patterns

**Fix Example**:
```javascript
// Handle negative or zero growth
if (dailyGrowth <= 0) {
  return { eta: null, confidence: 'low', message: 'No growth detected' };
}

// Cap maximum ETA
const daysToMilestone = Math.min((milestone - current) / dailyGrowth, 730); // Max 2 years
```

### Issue: Recently achieved milestones not showing
**Symptoms**: Milestones that were reached aren't displaying
**Solutions**:
1. Verify milestone achievement logging is working
2. Check database query date range is correct
3. Ensure timezone handling is consistent
4. Validate milestone detection logic (crossing threshold)
5. Check if milestone log has write permissions

**Debug Check**:
```javascript
console.log(`Checking milestones from ${thirtyDaysAgo} to ${now}`);
console.log(`Found achievements: ${recentMilestones.length}`);
recentMilestones.forEach(m =>
  console.log(`${m.metric}: ${m.value} on ${m.date}`)
);
```

### Issue: Confidence scores always showing as "low"
**Symptoms**: All ETA predictions marked as low confidence
**Solutions**:
1. Check R-squared calculation implementation
2. Verify sufficient data points for regression analysis
3. Review confidence threshold values (may be too strict)
4. Ensure growth data has variance (not flat line)
5. Check for data quality issues (missing values, outliers)

**Calculation Validation**:
```javascript
console.log(`Data points: ${dataPoints.length}`);
console.log(`R-squared: ${rSquared}`);
console.log(`Growth variance: ${variance}`);
console.log(`Confidence level: ${confidence}`);
```

### Issue: Progress bars not rendering correctly
**Symptoms**: Bars showing wrong percentage or malformed characters
**Solutions**:
1. Verify current value and milestone value are correct types (numbers)
2. Check percentage calculation doesn't exceed 100%
3. Ensure Unicode characters render in Discord
4. Handle edge cases: current > milestone, zero milestone
5. Test with various percentage values

**Bounds Checking**:
```javascript
const progress = Math.min(Math.max((current / milestone) * 100, 0), 100);
const filledLength = Math.round((progress / 100) * BAR_WIDTH);
```

### Issue: Multiple platforms showing same milestone
**Symptoms**: Different metrics showing identical milestone targets
**Solutions**:
1. Ensure milestone calculation is per-metric, not global
2. Verify metric-specific data is being fetched correctly
3. Check for variable scope issues (reusing same variable)
4. Validate each platform has independent milestone tracking

### Issue: Motivational messages not changing
**Symptoms**: Same message displays regardless of progress
**Solutions**:
1. Check threshold comparison logic (using >= vs >)
2. Verify thresholds are sorted correctly (descending order)
3. Ensure progress percentage is calculated before message selection
4. Test boundary conditions (exactly 90%, 75%, etc.)

**Logic Check**:
```javascript
// Sort thresholds descending
const sortedMessages = MOTIVATIONAL_MESSAGES.sort((a, b) => b.threshold - a.threshold);

// Find first matching threshold
const message = sortedMessages.find(m => progress / 100 >= m.threshold);
```

### Issue: Command times out for artists with many milestones
**Symptoms**: Command doesn't respond or takes >3 seconds
**Solutions**:
1. Limit number of upcoming milestones shown (e.g., next 3-5)
2. Optimize database queries with proper indexes
3. Cache milestone calculations (TTL: 15-30 minutes)
4. Use Discord defer() to extend response time
5. Implement pagination for milestone history

**Optimization**:
```javascript
// Limit upcoming milestones
const upcomingMilestones = allMilestones
  .filter(m => m.value > current)
  .sort((a, b) => a.value - b.value)
  .slice(0, 5); // Show only next 5
```

### Issue: No milestones showing for new artists
**Symptoms**: "No milestones available" message
**Solutions**:
1. Check if artist has any metrics above threshold (100 minimum)
2. Verify artist data is properly linked in database
3. Ensure milestone thresholds include small values (100, 500)
4. Check if platform data is being fetched correctly
5. Add helpful message for artists below first milestone

**Helpful Message**:
```javascript
if (current < MILESTONES[0]) {
  return `Keep growing! First milestone is ${MILESTONES[0]}. Currently at ${current}.`;
}
```

### Issue: ETA shows "undefined" or "NaN"
**Symptoms**: ETA field displays invalid values
**Solutions**:
1. Add null checks for all calculations
2. Verify division by zero protection
3. Ensure date parsing is successful
4. Handle missing historical data gracefully
5. Provide fallback messages for unpredictable ETAs

**Null Safety**:
```javascript
const eta = dailyGrowth && dailyGrowth > 0
  ? Math.ceil((milestone - current) / dailyGrowth)
  : null;

const etaDisplay = eta !== null && eta > 0 && eta < 730
  ? formatETA(eta)
  : 'Unable to estimate';
```

## Performance Considerations
- **Response Time Target**: < 2 seconds per artist
- **Data Freshness**: Balance between accuracy and API rate limits (hourly updates recommended)
- **Historical Data Storage**: Retain 90 days minimum for trend analysis
- **Caching Strategy**: Cache milestone calculations for 15-30 minutes per artist
- **Database Indexes**: Index on artist_id, metric_type, timestamp for fast queries

## Future Enhancement Ideas
- Milestone sharing to social media with auto-generated graphics
- Custom milestone setting (user-defined targets)
- Comparative milestones (vs other artists or industry averages)
- Milestone streak tracking (consecutive achievements)
- Notification system for approaching milestones (90% threshold)
- Historical milestone timeline visualization
- Projected milestone dates calendar export
