# Viral Command Skill

## Purpose
Detect and track viral content moments with real-time alerts, velocity analysis, and momentum scoring across all platforms.

## Command Name
`/viral`

## Key Features
- Viral moment detection (3x+ multiplier, 20%+ growth)
- Cooling down content tracking (post-viral decline)
- Viral watch list (2x multiplier, 10%+ growth potential)
- Virality scoring (0-100 scale)
- Trigger identification (playlist placement, organic growth, viral post)
- Platform-specific viral tracking (Spotify, YouTube, Instagram)
- Velocity calculations (daily growth rate)
- Momentum levels (EXPLOSIVE, HOT, WARMING, QUIET)
- 4 timeframe options (24h, 7d, 30d, all-time)
- Baseline growth rate calculation (30-day average)

## Parameters
- **timeframe** (optional): Time period to analyze
  - Choices: Last 24 hours, Last 7 days, Last 30 days, All time
  - Default: Last 7 days

## Data Sources
- `data/latest.json` - Current metrics
- `data/historical/*.json` - Historical data for timeframe analysis

## Viral Detection Criteria

### Active Viral Moments
Requires ALL of:
1. **Growth Multiplier**: ≥3x normal growth rate
2. **Percentage Growth**: ≥20% in period
3. **Baseline Comparison**: Significantly above 30-day average

### Viral Watch List
Requires:
1. **Growth Multiplier**: ≥2x normal growth rate
2. **Percentage Growth**: ≥10% in period
3. **Status**: "Monitoring for viral potential"

### Cooling Down Content
Identifies content that:
1. **Was Viral**: Previous velocity >10/day
2. **Slowing**: Current velocity <50% of peak velocity
3. **Still Significant**: Gained substantial followers during viral period

## Virality Scoring (0-100)

### Score Calculation
```javascript
score = Math.min(100, multiplier * 10 + growthRate)
```

Components:
- **Multiplier Impact**: Each 1x multiplier = 10 points
- **Growth Rate Impact**: Direct percentage addition
- **Cap**: Maximum 100 points

### Score Interpretation
- **80-100**: 🔥🔥🔥 Extremely viral (explosive growth)
- **60-79**: 🔥🔥 Highly viral (strong momentum)
- **40-59**: 🔥 Viral (notable growth)
- **0-39**: Not viral (normal growth)

## Trigger Identification

### Spotify Triggers
- **100%+ growth**: "Possible playlist placement or viral track"
- **20-99% growth**: "Organic growth acceleration"

### YouTube Triggers
- **Recent acceleration detected**: "Recent video gaining traction"

### Instagram Triggers
- **50%+ growth**: "Possible viral post or feature"
- **30-49% growth**: "Strong organic growth"

## Platform-Specific Detection

### Spotify Monthly Listeners
- Baseline: 30-day average daily growth rate
- Multiplier threshold: 3x baseline for viral, 2x for watch
- Minimum growth: 20% for viral, 10% for watch

### YouTube Views
- Checks recent acceleration (last 7 days vs. overall period)
- Multiplier: Recent velocity / overall velocity
- Minimum growth: 100 views to qualify

### Instagram Followers
- Percentage-based detection
- 30%+ growth with 50+ followers = viral
- Multiplier estimated at 3x

## Velocity Analysis

### Daily Velocity Calculation
```javascript
dailyVelocity = totalGrowth / numberOfDays
```

### Baseline Velocity (30-day average)
```javascript
// Calculate average daily growth over 30 days
for (each day in 30-day period) {
  dailyGrowth = (today - yesterday) / yesterday
  avgGrowthRate += dailyGrowth
}
avgGrowthRate = avgGrowthRate / 29 // 30 days = 29 day-to-day comparisons
```

### Multiplier Calculation
```javascript
multiplier = currentVelocity / baselineVelocity
```

## Momentum Levels

Collective momentum based on total virality scores:
- **EXPLOSIVE**: Total score >200 (multiple viral moments)
- **HOT**: Total score >100 (significant viral activity)
- **WARMING**: Total score >50 (some viral potential)
- **QUIET**: Total score ≤50 (minimal viral activity)

## Embed Styling
- **Title**: "🔥 VIRAL CONTENT TRACKER"
- **Color**:
  - Red (0xFF0000) if viral moments detected
  - Yellow (0xFFFF00) if no viral moments (watch/quiet)
- **Footer**: Collective momentum level + count of viral moments
- **Timestamp**: Current time

## Embed Sections

### 1. Active Viral Moments (🚨)
Shows top 3 by virality score:
- Artist + platform
- Virality score with fire emojis
- Current value and growth percentage
- Daily velocity
- Growth multiplier
- Trigger identification

### 2. Cooling Down (💤)
Shows top 2 previously viral content:
- Artist + platform + metric
- Peak velocity vs. current velocity
- Total gained during viral period

### 3. Viral Watch (👀)
Shows top 3 potential viral content:
- Artist + platform + metric
- Current value and growth percentage
- Velocity multiplier
- Monitoring status

### 4. Insights (💡)
Context-aware tips:
- Active viral: "Keep promoting the viral content across all platforms!"
- Watch list: "Some content showing potential - boost with cross-promotion!"
- No activity: "Consider releasing new content or running promotions."

## Common Modifications

### Adjusting Viral Thresholds
**Location**: Lines 200, 215, 244, 272

**Current Thresholds**:
```javascript
if (multiplier > 3 && growthRate > 20) {  // Viral
if (multiplier > 2 && growthRate > 10) {  // Watch list
if (recentVelocity > dailyVelocity * 2 && recentGrowth > 100) {  // YouTube viral
if (growthRate > 30 && growth > 50) {  // Instagram viral
```

**To Make More Sensitive** (detect more viral content):
- Lower multipliers (e.g., 2x instead of 3x)
- Lower percentage thresholds (e.g., 15% instead of 20%)

**To Make Stricter** (fewer false positives):
- Raise multipliers (e.g., 4x instead of 3x)
- Raise percentage thresholds (e.g., 30% instead of 20%)

### Modifying Baseline Calculation
**Location**: Lines 168-187
- Change historical period (currently 30 days)
- Adjust normalization factor
- Add weighted average (recent data more important)

### Changing Display Limits
- **Active viral moments**: Line 70 - `.slice(0, 3)`
- **Cooling down**: Line 100 - `.slice(0, 2)`
- **Viral watch**: Line 112 - `.slice(0, 3)`

### Adding New Platforms
1. Add platform velocity calculation
2. Define baseline for platform
3. Calculate multiplier
4. Check against thresholds
5. Add to appropriate result array

## Cooldown Detection Logic

```javascript
const oldVelocity = (prevListeners - veryOldListeners) / (historicalLength - 7);
const currentVelocity = (listeners - prevListeners) / 7;

if (oldVelocity > 0 && currentVelocity < oldVelocity * 0.5 && oldVelocity > 10) {
  // Content is cooling down
}
```

## Data Requirements

### Minimum Data
- **24h timeframe**: 2 days minimum
- **7d timeframe**: 8 days minimum
- **30d timeframe**: 31 days minimum
- **All-time**: All available data (up to 168 days loaded)

### Optimal Data
- 30+ days for accurate baseline calculation
- Consistent daily data (no gaps)
- Complete platform data for all artists

## Troubleshooting

### Issue: "Not enough data to detect viral moments"
**Cause**: Less than 2 days of historical data
**Solution**:
- Wait for more data collection
- Check data collection automation
- Verify files in `data/historical/`

### Issue: False positives (non-viral content flagged)
**Cause**:
- Low baseline from slow growth period
- Data anomalies or gaps
- Artist recently added (no baseline)
**Solution**:
- Increase multiplier thresholds
- Increase percentage thresholds
- Add minimum absolute growth requirement

### Issue: Missing viral moments (false negatives)
**Cause**: Thresholds too strict
**Solution**:
- Lower multiplier requirements
- Lower percentage thresholds
- Check baseline calculation accuracy

### Issue: Baseline seems incorrect
**Cause**:
- Data gaps in historical period
- Recent dramatic changes
- Insufficient data points
**Solution**:
- Extend baseline calculation period
- Filter outliers from baseline
- Use median instead of mean

### Issue: YouTube viral detection not working
**Cause**: Total views too small or recent acceleration not significant
**Solution**: Lower minimum growth threshold (line 244)

## Velocity Calculation Example

```
Artist has gained 1,000 listeners in 7 days
Baseline: 50 listeners/day average over 30 days

Current velocity: 1,000 / 7 = 142.9 listeners/day
Multiplier: 142.9 / 50 = 2.86x
Growth rate: (1,000 / 5,000) * 100 = 20%

Result: 2.86x multiplier but <3x threshold
        20% growth rate meets threshold
        Categorized as "Viral Watch" (not full viral)
```

## Optimization Tips
1. Cache baseline calculations (update daily)
2. Implement notification system for new viral moments
3. Add viral moment persistence (database storage)
4. Track viral moment lifecycle
5. Correlate with release dates/promotions
6. Implement viral prediction model
7. Add content recommendation based on viral patterns
8. Create viral content library/archive

## Future Enhancements
- Viral moment notifications (push alerts)
- Viral content lifecycle tracking (rise, peak, decay)
- Viral prediction based on early signals
- Cross-platform viral correlation
- Viral content analytics dashboard
- Automated promotion recommendations
- Viral moment shareable cards
- Historical viral moments archive
- Viral trend analysis
- Content virality comparison
- Playlist/feature attribution
- Viral moment celebrations/badges
- Virality leaderboard
- Export viral reports
- Integration with marketing automation
