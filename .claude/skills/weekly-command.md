# Weekly Command Skill

## Purpose
Comprehensive weekly performance report with trends, predictions, highlights, achievements, and actionable insights for Casa 24 Records.

## Command Name
`/weekly`

## Key Features
- Configurable week offset (0-4 weeks back)
- Label-wide statistics across all platforms
- Week-over-week comparison percentages
- Artist performance rankings with star ratings (1-5 stars)
- Achievement detection (20%+ growth, 100+ listeners, etc.)
- Top content showcase (top 3 videos)
- Velocity analysis (Accelerating/Steady/Stable/Decelerating)
- Action items generation
- Overall week rating (EXCELLENT to NEEDS IMPROVEMENT)
- Tree-style formatting for visual hierarchy
- Medal system for top 3 artists
- Color-coded embeds based on total growth

## Parameters
- **week_offset** (optional): Which week to view
  - Min: 0 (current week)
  - Max: 4 (4 weeks ago)
  - Default: 0

## Data Sources
- `data/latest.json` - Current week endpoint
- `data/historical/*.json` - Previous week data for comparison

## Week Calculation

### Data Loading
```javascript
daysToLoad = (weekOffset + 1) * 7 + 1

Examples:
- Week 0 (current): Load 8 days (7 day span + 1)
- Week 1 (last week): Load 15 days
- Week 4 (4 weeks ago): Load 36 days
```

### Week Boundaries
```javascript
weekStartIndex = weekOffset * 7
weekEndIndex = weekStartIndex + 7

currentWeekData = historicalData[weekStartIndex]      // Week end
previousWeekData = historicalData[weekEndIndex]       // Week start
```

## Report Sections

### 1. Label Overview (🎯)
Week-over-week changes for entire label:
- **Spotify Followers**: Change + percentage
- **Monthly Listeners**: Change + percentage
- **YouTube Subscribers**: Change + percentage
- **YouTube Views**: Total new views
- **Instagram Followers**: Change + percentage
- **Discord Members**: Change + percentage

**Format**: Tree-style with branch characters (├─, └─)

### 2. Artist Highlights (🌟)
Top 5 artists ranked by total growth:
- Star rating (1-5 ⭐)
- Medal for top 3 (🥇, 🥈, 🥉)
- Platform-specific growth breakdown
- 🔥 indicator for 10%+ growth

### 3. Wins This Week (🏆)
Automatic achievement detection:
- **Lightning Growth**: 20%+ Spotify follower growth
- **Listener Surge**: 100+ new monthly listeners
- **YouTube Rising**: 10+ new subscribers

Shows top 5 achievements.

### 4. Top Content (🎵)
Top performing videos:
- Top 3 by view count
- Artist name + video title
- View count display

### 5. Velocity Analysis (📈)
Momentum assessment:
- **Momentum**: Accelerating / Steady / Stable / Decelerating
- **Best Platform**: Platform with highest growth
- **Artists Trending**: Count with >5% growth

### 6. Action Items
Context-aware recommendations:
1. Support top performing artist
2. Identify artists needing YouTube boost
3. Spotify playlist placement focus
4. Maintain consistent release schedule

## Artist Performance Metrics

### Total Growth Calculation
```javascript
totalGrowth = spotifyFollowerGrowth + youtubeSubscriberGrowth + instagramFollowerGrowth
```

### Growth Percentage
```javascript
growthPercent = (spotifyGrowth / prevSpotifyFollowers) * 100
```

### Star Rating Algorithm
```javascript
function calculateRating(totalGrowth, growthPercent) {
  let rating = 0;

  // Absolute growth points
  if (totalGrowth > 100) rating += 2;
  else if (totalGrowth > 50) rating += 1.5;
  else if (totalGrowth > 20) rating += 1;
  else if (totalGrowth > 0) rating += 0.5;

  // Percentage growth points
  if (growthPercent > 20) rating += 2;
  else if (growthPercent > 10) rating += 1.5;
  else if (growthPercent > 5) rating += 1;
  else if (growthPercent > 0) rating += 0.5;

  return Math.min(5, Math.ceil(rating));  // Max 5 stars
}
```

## Week Rating System

### Overall Performance Rating
Based on total growth across all artists:
- **EXCELLENT**: >500 total follower growth
- **GREAT**: >200 total growth
- **GOOD**: >100 total growth
- **AVERAGE**: >0 total growth
- **NEEDS IMPROVEMENT**: ≤0 total growth

### Momentum Levels
- **Accelerating**: >100 total growth
- **Steady**: >50 total growth
- **Stable**: >0 total growth
- **Decelerating**: ≤0 total growth

## Embed Styling
- **Title**: "📊 WEEKLY PERFORMANCE REPORT"
- **Description**: "Week of {start date} - {end date}"
- **Color**:
  - Green (0x00FF00) if positive total growth
  - Yellow (0xFFFF00) if negative/no growth
- **Footer**: Week rating + total growth + "Next Report: Monday 10 AM"
- **Timestamp**: Current time

## Common Modifications

### Adjusting Week Offset Range
**Location**: Lines 9-12
- Change max value (currently 4 weeks)
- Allows viewing further back in history

### Modifying Achievement Thresholds
**Location**: Lines 97-106
Current thresholds:
- Spotify growth: 20%
- Listener growth: 100
- YouTube growth: 10

To adjust:
```javascript
if (growthPercent > 15) {  // Lower from 20% to 15%
  achievements.push(`⚡ ${artist.name}: Lightning growth! +${growthPercent.toFixed(0)}% Spotify followers`);
}
```

### Changing Star Rating Criteria
**Location**: Function calculateRating() at lines 261-275
- Adjust absolute growth thresholds
- Modify percentage growth thresholds
- Change point values

### Updating Top Content Limit
**Location**: Line 210
- Change `.slice(0, 3)` to show more/fewer videos
- Must also update display loop

### Modifying Action Items
**Location**: Lines 232-243
- Add new automated action items
- Customize conditions for recommendations
- Personalize messaging

### Changing Artist Display Limit
**Location**: Line 164
- Change `Math.min(5, artistPerformance.length)` to show more/fewer
- Consider pagination for large lists

## Data Format Requirements

### Artist Data Structure
Each historical snapshot needs:
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
        "total_views": 45678,
        "top_videos": [
          { "title": "Video Title", "views": 1234 }
        ]
      },
      "instagram": {
        "followers": 456
      }
    }
  ],
  "discord": {
    "member_count": 123
  }
}
```

## Tree-Style Formatting

### Branch Characters
```
├─  Branch (middle item)
└─  End branch (last item)
```

### Example Output
```
Total Growth This Week
├─ 🎵 Spotify: +45 followers (12.3%) 📈
├─ 🎧 Listeners: +123 (8.5%) 📈
├─ 📺 YouTube: +5 subs (4.2%) 📈
├─ 👁️ Views: +1,234 views
├─ 📸 Instagram: +12 followers (3.1%) 📈
└─ 💬 Discord: +3 members
```

## Troubleshooting

### Issue: "Not enough data for weekly analysis"
**Cause**: Less than 8 days of historical data
**Solution**: Wait for more data collection to reach minimum threshold

### Issue: Week dates seem incorrect
**Cause**: Week calculation offset error
**Solution**: Verify weekStartIndex and weekEndIndex calculations

### Issue: Artists missing from report
**Cause**: Artist not present in both start and end data
**Solution**: Check if artist was added mid-week (skip comparison)

### Issue: Achievement detection not working
**Cause**: Thresholds too high or data issues
**Solution**:
- Lower thresholds
- Check data quality for week
- Verify growth calculations

### Issue: Top content showing old videos
**Cause**: View count may not have updated
**Solution**: Check data collection frequency

### Issue: Star ratings all same
**Cause**: Similar growth patterns across artists
**Solution**: Working as intended - adjust thresholds if needed

## Calculation Examples

### Example 1: High Performer
```
Artist: "Chef Lino"
Spotify Growth: +67 followers (22% growth)
YouTube Growth: +12 subscribers
Instagram Growth: +8 followers
Total Growth: 87 followers

Star Rating Calculation:
- Total >50: +1.5 points
- Percent >20%: +2 points
- Total: 3.5 → rounds to 4 stars ⭐⭐⭐⭐
```

### Example 2: Moderate Performer
```
Artist: "PYRO"
Spotify Growth: +23 followers (7% growth)
YouTube Growth: +3 subscribers
Instagram Growth: +2 followers
Total Growth: 28 followers

Star Rating Calculation:
- Total >20: +1 point
- Percent >5%: +1 point
- Total: 2 → 2 stars ⭐⭐
```

## Performance Optimization
- Report generation is O(n) where n = number of artists
- Historical data loading most expensive operation
- Consider caching weekly reports (update once daily)
- Precompute on Monday mornings for consistency

## Optimization Tips
1. **Schedule Generation**: Auto-generate Monday 10 AM
2. **Cache Reports**: Store generated reports for 7 days
3. **Parallel Processing**: Calculate artist stats in parallel
4. **Incremental Updates**: Only recalculate if new data available
5. **Notification System**: Alert for new weekly report
6. **Export Options**: PDF/image export for sharing
7. **Historical Comparison**: Compare to same week last month/year

## Future Enhancements
- Multi-week trend analysis (4-week moving average)
- Year-over-year comparisons
- Weekly goals and target tracking
- Predictive next week forecast
- Automated social media posting
- Executive summary mode
- Detailed artist deep-dives
- Custom week ranges (not just 7 days)
- Week-to-week momentum tracking
- Seasonal adjustment (account for trends)
- Competitive analysis (vs. industry benchmarks)
- Visual charts and graphs
- Email digest version
- Weekly highlights video generation
- Integration with project management tools
