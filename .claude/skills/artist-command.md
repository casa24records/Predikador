# Artist Command

## Purpose
Displays comprehensive artist profile with detailed statistics across all three platforms (Spotify, YouTube, Instagram). Provides a unified view of an artist's digital presence with platform-specific metrics, top content, and direct links.

## Command Name
`/artist`

## Key Features
- **Multi-Platform Stats Display** (Spotify, YouTube, Instagram)
- **Spotify Integration**: Followers, monthly listeners, popularity score, genres, top 5 tracks
- **YouTube Integration**: Subscriber count, total views, video count, top 3 videos with clickable links
- **Instagram Integration**: Follower count, media count, username with profile link
- **Autocomplete Selection** for easy artist lookup
- **Flexible Name Matching** (case-insensitive, handles name variations)
- **Color-Coded Embeds** for visual distinction
- **Error Handling** for missing platforms or artists

## Parameters

### Required Parameters
- `artist` (String, Autocomplete)
  - Description: Name of the artist to display profile for
  - Uses autocomplete to show available artists
  - Searches database for matching artist
  - Case-insensitive matching
  - Handles partial matches and name variations

## Platform Data Displayed

### Spotify Section
**Primary Metrics:**
- Followers (formatted with comma separators)
- Monthly Listeners (formatted with comma separators)
- Popularity Score (0-100 scale)
- Genres (comma-separated list, up to all genres)
- Top 5 Tracks with clickable Spotify links

**Data Requirements:**
```json
{
  "spotify": {
    "id": "spotify_artist_id",
    "followers": 123456,
    "monthlyListeners": 654321,
    "popularity": 85,
    "genres": ["pop", "latin", "reggaeton"],
    "topTracks": [
      {
        "name": "Track Name",
        "url": "https://open.spotify.com/track/..."
      }
    ]
  }
}
```

### YouTube Section
**Primary Metrics:**
- Subscriber Count (formatted)
- Total Views (formatted)
- Video Count (total uploaded videos)
- Top 3 Videos with titles and clickable YouTube links

**Data Requirements:**
```json
{
  "youtube": {
    "channelId": "UC...",
    "subscribers": 12345,
    "totalViews": 9876543,
    "videoCount": 234,
    "topVideos": [
      {
        "title": "Video Title",
        "url": "https://youtube.com/watch?v=..."
      }
    ]
  }
}
```

### Instagram Section
**Primary Metrics:**
- Follower Count (formatted)
- Media Count (total posts)
- Username with clickable profile link

**Data Requirements:**
```json
{
  "instagram": {
    "username": "artist_handle",
    "followers": 54321,
    "mediaCount": 456
  }
}
```

## Data Sources

### Primary Data File
**Location**: `C:\Users\14049\OneDrive\Documents\Website\BOT\claude\data\artists.json`

**Structure**:
```json
{
  "artists": [
    {
      "name": "Artist Name",
      "spotify": { /* Spotify data */ },
      "youtube": { /* YouTube data */ },
      "instagram": { /* Instagram data */ }
    }
  ]
}
```

### Artist Lookup Logic
1. Read `artists.json` from data directory
2. Search for artist by name (case-insensitive)
3. Handle name variations (e.g., "The Artist" vs "Artist")
4. Return complete artist object with all platform data

## Common Modifications

### Changing Number of Top Items

**Top Tracks** (Line ~80-100):
```javascript
const topTracks = artistData.spotify.topTracks.slice(0, 5);
// Change 5 to different number to show more/fewer tracks
```

**Top Videos** (Line ~120-140):
```javascript
const topVideos = artistData.youtube.topVideos.slice(0, 3);
// Change 3 to different number to show more/fewer videos
```

### Customizing Embed Appearance

**Embed Color** (Line ~50):
```javascript
const embed = new EmbedBuilder()
  .setColor('#1DB954') // Spotify green, change to any hex color
```

**Field Layout** (Line ~70-150):
```javascript
.addFields(
  { name: 'Platform', value: 'Stats', inline: true },
  // Add inline: false for full-width fields
  // Reorder fields to change display order
)
```

### Adding New Metrics

1. Ensure data exists in `artists.json`
2. Add field to embed:
```javascript
.addFields({
  name: '📊 New Metric',
  value: `${artistData.platform.newMetric.toLocaleString()}`,
  inline: true
})
```

### Modifying Autocomplete Behavior

**Number of Suggestions** (Line ~20-30):
```javascript
const filtered = artists.filter(/* ... */).slice(0, 25);
// Discord max is 25, can reduce for faster performance
```

**Matching Algorithm** (Line ~25):
```javascript
artist.name.toLowerCase().includes(focusedValue.toLowerCase())
// Modify to use startsWith(), exact match, or fuzzy matching
```

### Adding Platform Badges/Icons

**Emoji Indicators** (Line ~60-70):
```javascript
const spotifyEmoji = '🎵'; // Customize platform emojis
const youtubeEmoji = '📺';
const instagramEmoji = '📷';
```

## Error Handling

### Artist Not Found
**Behavior**: Returns error message embed
**User Feedback**: "Artist not found. Please check the name and try again."
**Solution**: Shows available artists or suggests similar names

### Missing Platform Data
**Behavior**: Skips section if platform data is null/undefined
**Display**: Only shows available platforms
**Example**: If no Instagram data, YouTube and Spotify still display

### Incomplete Data Fields
**Behavior**: Shows "N/A" or skips specific field
**Graceful Degradation**:
- Missing top tracks? Shows followers/listeners only
- No genre data? Shows "Genre information unavailable"

### API/Data File Issues
**File Not Found**: Error logged, user sees "Unable to load artist data"
**Corrupted JSON**: Catches parse error, prompts data validation
**Empty Artists Array**: "No artists in database"

## Troubleshooting

### Issue: Artist not appearing in autocomplete
**Cause**: Artist not in database or name mismatch
**Solution**:
- Verify artist exists in `artists.json`
- Check `name` field is properly set
- Ensure JSON file is valid (no syntax errors)
- Bot requires restart after manual edits to `artists.json`

### Issue: Stats showing as undefined or NaN
**Cause**: Missing fields in artist data object
**Solution**:
- Check all required fields exist in `artists.json`
- Verify data types (numbers not strings)
- Add null checks: `artistData.spotify?.followers || 0`

### Issue: Top tracks/videos not showing
**Cause**: Empty or missing topTracks/topVideos arrays
**Solution**:
- Ensure tracking script populates these arrays
- Check Spotify/YouTube API responses include top content
- Verify array structure matches expected format

### Issue: Links not clickable in Discord
**Cause**: Incorrect markdown formatting
**Solution**:
- Use format: `[Display Text](https://url.com)`
- Ensure no spaces in URL
- Check URL encoding for special characters

### Issue: Embed too long or hitting Discord limits
**Cause**: Too much data in single embed
**Solution**:
- Discord embed limit: 6000 total characters
- Reduce number of top items shown
- Shorten genre lists (show top 3-5 genres)
- Split into multiple embeds if needed

### Issue: Number formatting inconsistent
**Cause**: Missing or incorrect toLocaleString() usage
**Solution**:
```javascript
// Consistent formatting
const formatted = value.toLocaleString('en-US');
// For unavailable data
const formatted = value?.toLocaleString() || 'N/A';
```

## Performance Considerations

### File I/O Optimization
- **Current**: Reads `artists.json` on every command
- **Improvement**: Cache artists data in memory
- **Cache Invalidation**: Reload when data updated

### Autocomplete Performance
- Searches entire artist array on each keystroke
- Consider indexing for large databases (100+ artists)
- Pre-filter inactive/archived artists

### API Rate Limits
- Command shows cached data from `artists.json`
- No live API calls during display
- Updates handled by separate tracking script

## Related Commands
- `/achievements` - Shows achievement progress using same artist data
- `/growth` - Displays growth trends for artist
- `/battle` - Compare two artists' stats
- `/profile` - Alternative condensed view

## Data Update Workflow

### Manual Update
1. Edit `C:\Users\14049\OneDrive\Documents\Website\BOT\claude\data\artists.json`
2. Validate JSON syntax
3. Restart bot to reload data (or implement hot-reload)

### Automated Update
1. Tracking script fetches fresh data from APIs
2. Updates `artists.json` with new stats
3. Historical snapshot saved to `data/history/[date].json`
4. Bot automatically picks up changes on next command

### Data Validation Checklist
- [ ] All required fields present (followers, subscribers, etc.)
- [ ] Numbers are numeric type, not strings
- [ ] Arrays properly formatted (topTracks, topVideos)
- [ ] URLs valid and properly formatted
- [ ] No duplicate artist entries

## Future Enhancement Ideas
- **Visual Charts**: Add follower growth charts using chart library
- **Comparative Stats**: Show artist rank within Casa 24 collective
- **Social Links**: Add TikTok, Twitter/X, Facebook stats
- **Recent Activity**: Show latest releases, uploads, posts
- **Engagement Metrics**: Add likes, comments, view duration
- **Historical Comparison**: Show stats change from last week/month
- **Export Options**: Generate shareable image card of stats
- **Webhook Integration**: Auto-post profile on artist milestones
