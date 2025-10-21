# 🎵 Casa 24 Bot - Commands Quick Reference (BUILT & READY)

## Command Overview

| Command | Metaphor | Primary Visual | Best For |
|---------|----------|----------------|----------|
| `/galaxy` | Space/Universe | Emoji constellation heat map | Understanding collective hierarchy & growth |
| `/rhythm` | Music | Musical notation patterns | Artists who think in beats/rhythm |
| `/weather` | Meteorology | Forecast symbols & alerts | Predictive insights & viral warnings |
| `/journey` | RPG/Gaming | Quest map with checkpoints | Milestone tracking with gamification |
| `/heatwave` | Activity Calendar | GitHub-style heat map | Spotting consistency patterns |
| `/stadium` | Sports Stats | Trading card format | Competitive rankings & achievements |
| `/constellation` | Network Graph | ASCII relationship map | Understanding artist connections |
| `/speedometer` | Racing Dashboard | Gauges and instruments | Real-time velocity & performance |
| `/timeline` | Biography | Vertical story timeline | Historical narrative & future prediction |
| `/pulse` | Medical Monitor | Vital signs display | Overall health assessment |

## When to Use Each Command

### For Quick Snapshots:
- `/galaxy` - Fast visual overview of the entire collective
- `/speedometer` - Current velocity and performance
- `/pulse` - Health check of the collective

### For Deep Analysis:
- `/timeline` - Complete historical journey
- `/journey` - Detailed milestone tracking
- `/constellation` - Artist relationship insights

### For Sharing on Social Media:
- `/weather` - Fun, accessible format
- `/rhythm` - Unique and artistic
- `/stadium` - Sports fans love stats cards
- `/galaxy` - Visually stunning

### For Motivation:
- `/journey` - Gamified progress tracking
- `/speedometer` - Racing to the finish line
- `/timeline` - Story of success

### For Strategic Planning:
- `/constellation` - Find collaboration opportunities
- `/weather` - Predictive alerts for action
- `/pulse` - Diagnostic recommendations

## Visual Style Breakdown

### ASCII Art Heavy:
- `/galaxy` - Star patterns
- `/constellation` - Network graphs
- `/speedometer` - Dashboard gauges
- `/pulse` - Medical monitor displays

### Emoji Intensive:
- `/rhythm` - Musical notes (♪ ♫ 🎵 🎶)
- `/weather` - Weather symbols (☀️ ⛅ ⛈️ 🌈)
- `/heatwave` - Color blocks (⬜ 🟩 🟨 🟧 🟟 🔥)
- `/stadium` - Sport icons (🏆 ⚡ 💪)

### Progress Bars:
- `/journey` - Quest progress [████████░░░░]
- `/milestone` - Checkpoint tracking
- `/pulse` - Vital sign indicators
- `/speedometer` - Gauge fills

### Narrative Format:
- `/timeline` - Vertical story with quotes
- `/weather` - Report-style commentary
- `/stadium` - Card with stats and notes

## Data Requirements

All commands leverage:
- **168 days** of historical data in `/data/historical/`
- **Latest snapshot** in `/data/latest.json`
- **8 artists** across Casa 24 collective
- **Multi-platform metrics**: Spotify, YouTube, Instagram, Discord

### Available Metrics:
- Spotify: followers, monthly_listeners, popularity_score
- YouTube: subscribers, total_views, video_count
- Instagram: followers, media_count
- Discord: member_count, online_count

## Implementation Priority

### Phase 1 (High Impact, Lower Complexity):
1. `/weather` - Fun and accessible
2. `/speedometer` - Clean visualization
3. `/heatwave` - Simple but effective

### Phase 2 (Medium Complexity):
4. `/galaxy` - Emoji positioning
5. `/stadium` - Stats card formatting
6. `/rhythm` - Pattern detection

### Phase 3 (Complex, High Value):
7. `/journey` - Quest system logic
8. `/timeline` - Narrative generation
9. `/constellation` - Network analysis
10. `/pulse` - Multi-metric health scoring

## Key Features by Command

### `/galaxy` 🌌
- Artist size based on total reach
- Growth represented by emoji intensity
- Platform dominance indicators
- Collective expansion metrics

### `/rhythm` 🎵
- Growth patterns as musical bars
- Tempo based on velocity
- Different notes for growth levels
- Composition analysis

### `/weather` 🌤️
- Current conditions per artist
- 7-30 day forecasts
- Viral storm warnings
- Temperature = growth heat

### `/journey` 🗺️
- RPG-style quest progress
- Boss battles = milestones
- XP and level system
- Active/completed quests
- Treasure = viral moments

### `/heatwave` 🔥
- GitHub-style activity grid
- Color intensity = daily growth
- Pattern analysis
- Streak detection

### `/stadium` 🏟️
- Player card format
- Season statistics
- Advanced metrics (PER, EFF)
- Rankings and awards
- Highlight reel

### `/constellation` ✨
- Network graph of artists
- Connection strength lines
- Collaboration suggestions
- Cluster analysis
- Synergy scores

### `/speedometer` 🏎️
- Speed = daily growth rate
- RPM = engagement
- Fuel = consistency
- Boost = momentum
- Trip computer stats

### `/timeline` 📜
- Vertical event timeline
- Past + present + future
- Narrative quotes
- Milestone markers
- Chapter/act structure

### `/pulse` 💓
- Heart rate = activity
- Blood pressure = engagement
- Temperature = virality
- Blood work = platform metrics
- Doctor's prescription

## Engagement Strategies

### Make It Competitive:
- Rankings in `/stadium`
- Leaderboards in `/galaxy`
- Race positions in `/speedometer`

### Make It Social:
- Collaboration suggestions in `/constellation`
- Network effects in `/galaxy`
- Team health in `/pulse`

### Make It Gamified:
- Achievements in `/journey`
- Streaks in `/heatwave`
- Level-ups in `/journey`

### Make It Predictive:
- Forecasts in `/weather`
- ETAs in `/journey`
- Prognosis in `/pulse`
- Projections in `/timeline`

### Make It Personal:
- Individual stories in `/timeline`
- Custom cards in `/stadium`
- Artist focus in all commands

## Design Principles

1. **Every output should be screenshot-worthy**
2. **Use familiar metaphors** (sports, weather, games, etc.)
3. **Balance data density with readability**
4. **Include actionable insights**, not just stats
5. **Create emotional connections** to the numbers
6. **Make comparisons easy** (time, artists, platforms)
7. **Predict the future** when possible
8. **Celebrate achievements** prominently
9. **Use consistent emoji libraries**
10. **Format for Discord's fixed-width rendering**

## Technical Implementation Notes

### Shared Utilities:
```javascript
// From /bot/utils/analytics.js
- calculateGrowth(current, previous)
- calculatePlatformGrowth(historicalData, artist, platform, metric)
- predictMetric(historicalData, artist, platform, metric, daysAhead)
- formatNumber(num)
- formatPercent(percent)

// From /bot/utils/dataLoader.js
- loadLatestData()
- loadHistoricalData(days)
- getArtistByName(data, artistName)
- getAllArtistNames(data)
```

### New Utilities Needed:
```javascript
// For /constellation
- calculateArtistSimilarity(artist1, artist2)
- detectClusters(artists)
- suggestCollaborations(artists)

// For /rhythm
- detectGrowthPattern(timeSeries)
- convertToMusicalNotation(values)
- analyzeComposition(pattern)

// For /galaxy
- calculateReach(artist)
- determineSize(reach)
- positionInGalaxy(artists)

// For /journey
- calculateQuestProgress(current, target)
- detectTreasure(viralMoments)
- determineLevel(totalGrowth)

// For /pulse
- calculateVitalSigns(artistData)
- assessHealth(vitals)
- generatePrescription(diagnostics)
```

## Customization Options

Each command should support:
- **Artist filtering**: Focus on specific artist or collective
- **Time ranges**: 7d, 30d, 90d, all-time
- **Metric selection**: Spotify, YouTube, Instagram, or all
- **Detail levels**: Compact vs. detailed views
- **Comparison modes**: Artist vs. artist, time vs. time

## Future Enhancements

### Interactive Elements:
- Buttons for "[View More]", "[Compare]", "[Share]"
- Autocomplete for artist names
- Dynamic time range selection

### Automation:
- Scheduled reports (daily/weekly)
- Automatic alerts for milestones
- Viral moment notifications
- Anomaly detection alerts

### Personalization:
- User can set favorite artists
- Custom milestone targets
- Preferred visualization styles
- Alert thresholds

### Integration:
- Export to image files
- Share to Twitter/Instagram
- Webhook notifications
- Dashboard web view

---

**Total Commands**: 10 unique visualizations
**Total Metaphors**: Space, Music, Weather, Gaming, Sports, Medical, Network, Racing, Biography, Activity
**Engagement Goal**: Turn analytics into entertainment
**Success Metric**: Users voluntarily check stats daily and share results
