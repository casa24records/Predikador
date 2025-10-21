# Spotlight Command Skill

## Purpose
Random artist showcase with weighted selection, dynamic presentation, interactive engagement, and call-to-action for audience support.

## Command Name
`/spotlight`

## Key Features
- Weighted random artist selection (favors growing artists)
- 7-day growth analysis for weight calculation
- Dynamic tagline generation (8 base taglines + stat-based)
- Comprehensive artist profile display
- Top tracks (Spotify) and videos (YouTube)
- Social media usernames and platform links
- Interactive reactions (fire 🔥 and eyes 👀 emojis)
- Random color theming for visual variety
- Support instructions for each platform
- Direct action buttons with platform links (optional)

## Parameters
None - completely random selection

## Data Sources
- `data/latest.json` - Current artist metrics
- `data/historical/*.json` - 7 days for growth-based weighting

## Selection Weighting System

### Base Weight
Every artist starts with: **10 points**

### Growth Bonuses
Based on 7-day total follower growth:
- **>10% growth**: +30 weight (40 total)
- **>5% growth**: +20 weight (30 total)
- **>0% growth**: +10 weight (20 total)
- **Negative/no growth**: Base weight only (10 total)

### Selection Algorithm
```javascript
// Build weighted array
for (let i = 0; i < weight; i++) {
  artistWeights.push(artist);
}

// Random selection from weighted array
const featured = artistWeights[Math.floor(Math.random() * artistWeights.length)];
```

**Result**: Artists with higher growth appear more times in selection pool, increasing their chance of being featured.

## Dynamic Tagline Generation

### Stat-Based Taglines
Priority order (checks first match):
1. **"The Chart Climber"** - Monthly listeners > 500
2. **"The Fan Favorite"** - Spotify followers > 300
3. **"The Visual Storyteller"** - YouTube views > 10,000
4. **"The Social Media Star"** - Instagram followers > 1,000

### Base Taglines (Random)
If no stat criteria met:
- "The Rising Star"
- "The Creative Force"
- "The Sonic Innovator"
- "The Rhythm Master"
- "The Melody Maker"
- "The Beat Architect"
- "The Sound Sculptor"
- "The Musical Visionary"

## Embed Sections

### Header
- Title: "✨ ARTIST SPOTLIGHT ✨"
- Description: "Today's featured artist is... # 🎤 {Artist Name} 🎤"
- Tagline: *"{Dynamic Tagline}"*

### Growth Alert
- Shows 7-day growth metrics
- Emojis: 🔥 (positive growth) or ➡️ (stable)
- Growth text examples:
  - "+15% growth this week!"
  - "+42 new listeners this week!"
  - "Steady performance"

### Quick Stats
Platform breakdowns:
- **Spotify**: Followers, monthly listeners
- **YouTube**: Subscribers, total views
- **Instagram**: Followers, post count

### Top Content
- **Top Tracks**: Top 3 Spotify tracks with popularity scores
- **Latest Hit Video**: Top YouTube video with view count

### Support Section
Platform-specific instructions:
- 🎵 Stream on Spotify
- 📺 Subscribe on YouTube
- 📸 Follow @{username} on Instagram
- Reaction instructions

## Interactive Elements

### Auto-Reactions
Adds two reactions to the message:
1. 🔥 - "if you're already a fan!"
2. 👀 - "if you'll check them out!"

### Action Buttons (Optional)
Currently commented out but available:
- **Spotify Button**: "Listen on Spotify" with artist link
- **Instagram Button**: "Follow on Instagram" with profile link

## Spotify Artist ID Mapping

Hardcoded mapping for direct links:
```javascript
{
  'Casa 24': '2QpRYjtwNg9z6KwD4fhC5h',
  'Chef Lino': '56tisU5xMB4CYyzG99hyBN',
  'PYRO': '5BsYYsSnFsE9SoovY7aQV0',
  'bo.wlie': '2DqDBHhQzNE3KHZq6yKG96',
  'Mango Blade': '4vYClJG7K1FGWMMalEW5Hg',
  'ZACKO': '3gXXs7vEDPmeJ2HAOCGi8e',
  'ARANDA': '7DFovnGo8GZX5PuEyXh6LV'
}
```

## Embed Styling
- **Color**: Random (0x000000 to 0xFFFFFF) - each spotlight has unique color
- **Timestamp**: Current time
- **Footer**: "Spotlight changes hourly • Use /artist for detailed stats"

## Common Modifications

### Adjusting Growth Weight Bonuses
**Location**: Lines 39-43
```javascript
if (growthRate > 10) weight += 30;      // Change 30 to adjust
else if (growthRate > 5) weight += 20;  // Change 20 to adjust
else if (growthRate > 0) weight += 10;  // Change 10 to adjust
```

### Adding New Taglines
**Location**: Lines 241-265
1. Add to stat-based conditions (lines 254-261)
2. Add to base taglines array (lines 242-251)

### Modifying Top Content Limits
- **Top Tracks**: Line 128 - `.slice(0, 3)` (currently 3)
- **Top Video**: Line 137 - Shows only 1 video

### Enabling Action Buttons
**Location**: Lines 200-228
- Uncomment lines 228 to enable buttons
- Ensure Spotify IDs are mapped for all artists
- Add more buttons as needed

### Changing Reaction Emojis
**Location**: Lines 232-235
- Change emoji characters
- Add/remove reactions
- Customize reaction instructions (line 193)

### Updating Spotify ID Mapping
**Location**: Lines 267-280
- Add new artists with their Spotify IDs
- Find Spotify IDs from artist profile URLs
- Format: `'Artist Name': 'spotify_artist_id'`

## Engagement Tracking

### Potential Metrics to Track
- Reaction counts per spotlight
- Most featured artist (over time)
- Engagement rate by artist
- Spotify click-through rate (if buttons enabled)
- Time between spotlights

## Troubleshooting

### Issue: Same artist appears repeatedly
**Cause**: Higher growth weight makes them more likely
**Solution**:
- Working as intended (growth-based feature)
- Reduce growth bonuses
- Implement cooldown period (track recently featured)

### Issue: No growth data available
**Cause**: Less than 7 days of historical data
**Solution**: Falls back to base weight (10) for all artists

### Issue: Reactions not adding
**Cause**:
- Permission issues
- Discord API error
**Solution**: Check bot has "Add Reactions" permission

### Issue: Spotify buttons don't work
**Cause**: Artist ID not mapped or incorrect
**Solution**: Verify Spotify ID mapping (lines 267-280)

### Issue: Instagram link broken
**Cause**: Username missing or incorrect in data
**Solution**: Check `artist.instagram.username` exists in data

### Issue: Random color looks bad
**Cause**: Purely random RGB can produce odd colors
**Solution**: Limit to predefined color palette:
```javascript
const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
const color = colors[Math.floor(Math.random() * colors.length)];
```

## Utility Dependencies
- `loadLatestData()` - Current artist data
- `loadHistoricalData(7)` - 7-day growth calculation

## Optimization Tips
1. **Cooldown System**: Track last featured timestamp per artist
2. **Scheduled Spotlights**: Feature different artist every hour
3. **Engagement Analytics**: Track which artists get most reactions
4. **Smart Scheduling**: Feature artists before releases
5. **Rotation Guarantee**: Ensure all artists featured within X days
6. **Custom Weighting**: Allow manual boost for specific artists
7. **Themed Spotlights**: "Trending Tuesday," "Throwback Thursday"
8. **User Voting**: Let users vote on next spotlight

## Future Enhancements
- Artist spotlight history
- Countdown timer to next spotlight
- Featured artist of the week
- User-requested spotlights
- Spotlight leaderboard (most featured)
- Integration with release calendar
- Automated social media posting
- Spotlight analytics dashboard
- Custom spotlight messages from artists
- Fan testimonials/reviews
- Upcoming events/shows section
- Merch links integration
- Behind-the-scenes content
- Exclusive content unlocks
- Artist Q&A integration
