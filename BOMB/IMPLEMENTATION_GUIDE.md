# Implementation Guide - Creative Discord Commands

## Overview

This guide provides step-by-step instructions for implementing the 10 creative visualization commands for the Casa 24 Discord bot.

## Prerequisites

- Node.js v16+ installed
- Discord.js v14+ installed
- Existing bot structure in `/bot` directory
- Access to 168 days of historical data in `/data/historical`
- Existing utility functions in `/bot/utils/analytics.js`

## Project Structure

```
bot/
├── commands/
│   ├── galaxy.js          # New: Space visualization
│   ├── weather.js         # New: Weather forecast
│   ├── rhythm.js          # New: Musical patterns
│   ├── journey.js         # New: RPG quest map
│   ├── heatwave.js        # New: Activity heat map
│   ├── stadium.js         # New: Sports card
│   ├── constellation.js   # New: Network graph
│   ├── speedometer.js     # New: Racing dashboard
│   ├── timeline.js        # New: Story timeline
│   └── pulse.js           # New: Medical monitor
├── utils/
│   ├── analytics.js       # Existing
│   ├── dataLoader.js      # Existing
│   └── visualizations.js  # New: Shared visualization helpers
└── index.js               # Main bot file
```

## Step 1: Create Shared Visualization Utilities

Create `/bot/utils/visualizations.js`:

```javascript
/**
 * Shared visualization utility functions
 */

/**
 * Create a progress bar
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {number} length - Bar length (default: 20)
 * @returns {string} Progress bar string
 */
function createProgressBar(current, max, length = 20) {
    const filled = Math.floor((current / max) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Create a sparkline from array of values
 * @param {Array<number>} values - Array of numeric values
 * @returns {string} Sparkline string
 */
function createSparkline(values) {
    const ticks = '▁▂▃▄▅▆▇█';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) return ticks[0].repeat(values.length);

    return values.map(v => {
        const index = Math.floor(((v - min) / range) * (ticks.length - 1));
        return ticks[index];
    }).join('');
}

/**
 * Get emoji for growth trend
 * @param {number} percent - Growth percentage
 * @returns {string} Trend emoji
 */
function getTrendEmoji(percent) {
    if (percent > 10) return '🚀';
    if (percent > 5) return '📈';
    if (percent > 0) return '↗️';
    if (percent === 0) return '➡️';
    if (percent > -5) return '↘️';
    return '📉';
}

/**
 * Get size category emoji
 * @param {number} value - Numeric value
 * @param {Array} thresholds - Array of [threshold, emoji] pairs
 * @returns {string} Category emoji
 */
function getCategoryEmoji(value, thresholds) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value >= thresholds[i][0]) {
            return thresholds[i][1];
        }
    }
    return thresholds[0][1];
}

/**
 * Format a large number with metric suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted string (e.g., "1.2K", "3.4M")
 */
function formatMetric(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

/**
 * Create an ASCII box around text
 * @param {string} text - Text to box
 * @param {number} padding - Padding (default: 1)
 * @returns {string} Boxed text
 */
function createBox(text, padding = 1) {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const width = maxLength + (padding * 2);

    const top = '╔' + '═'.repeat(width) + '╗';
    const bottom = '╚' + '═'.repeat(width) + '╝';
    const padStr = ' '.repeat(padding);

    const boxed = [top];
    lines.forEach(line => {
        const padded = line.padEnd(maxLength);
        boxed.push('║' + padStr + padded + padStr + '║');
    });
    boxed.push(bottom);

    return boxed.join('\n');
}

/**
 * Generate day-of-week labels
 * @param {number} offset - Day offset (0 = today)
 * @returns {Array<string>} Array of day labels
 */
function getDayLabels(offset = 0) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const result = [];

    for (let i = 0; i < 7; i++) {
        const dayIndex = (today + offset + i) % 7;
        result.push(days[dayIndex]);
    }

    return result;
}

/**
 * Calculate percentile rank
 * @param {number} value - Value to rank
 * @param {Array<number>} values - Array of all values
 * @returns {number} Percentile (0-100)
 */
function calculatePercentile(value, values) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = sorted.indexOf(value);
    return Math.round((index / sorted.length) * 100);
}

module.exports = {
    createProgressBar,
    createSparkline,
    getTrendEmoji,
    getCategoryEmoji,
    formatMetric,
    createBox,
    getDayLabels,
    calculatePercentile
};
```

## Step 2: Implement Priority Commands

### High Priority (Week 1):

#### 1. /weather Command

Location: `/bot/commands/weather.js`

See example implementation in `/bot/commands/examples/weather.js`

**Key Features:**
- Current conditions per artist
- 7/14/30 day forecast
- Weather alerts for viral activity
- Climate summary with insights

**Testing:**
```bash
# In Discord
/weather
/weather region:Casa 24 forecast:7-day
/weather region:Chef Lino forecast:30-day
```

#### 2. /galaxy Command

Location: `/bot/commands/galaxy.js`

See example implementation in `/bot/commands/examples/galaxy.js`

**Key Features:**
- Visual constellation of artists
- Size based on total reach
- Heat intensity from growth rate
- Collective statistics

**Testing:**
```bash
/galaxy
/galaxy timeframe:30d
/galaxy timeframe:all-time
```

#### 3. /speedometer Command

Location: `/bot/commands/speedometer.js`

**Key Features:**
- ASCII speedometer gauge
- Multiple instrument readings
- Race position tracking
- Trip computer stats

**Implementation Notes:**
- Use Unicode box-drawing characters
- Keep gauges under 40 characters wide
- Update in real-time based on latest data

### Medium Priority (Week 2):

#### 4. /journey Command
#### 5. /heatwave Command
#### 6. /pulse Command

### Lower Priority (Week 3-4):

#### 7. /timeline Command
#### 8. /stadium Command
#### 9. /rhythm Command
#### 10. /constellation Command

## Step 3: Discord Bot Registration

Update `/bot/deploy-commands.js` to include new commands:

```javascript
const commands = [
    // Existing commands
    require('./commands/stats.js'),
    require('./commands/growth.js'),
    // ... other existing commands

    // New creative commands
    require('./commands/galaxy.js'),
    require('./commands/weather.js'),
    require('./commands/speedometer.js'),
    // ... add others as implemented
];
```

Deploy commands:
```bash
node bot/deploy-commands.js
```

## Step 4: Testing Protocol

### Unit Testing

Create `/bot/tests/visualizations.test.js`:

```javascript
const {
    createProgressBar,
    createSparkline,
    getTrendEmoji
} = require('../utils/visualizations');

// Test progress bar
console.log(createProgressBar(50, 100, 20));
// Expected: ██████████░░░░░░░░░░

// Test sparkline
console.log(createSparkline([1, 3, 2, 5, 7, 4, 8]));
// Expected: ▁▃▂▅▇▄█

// Test trend emoji
console.log(getTrendEmoji(12.5));
// Expected: 🚀
```

### Integration Testing

Test with real data:

```javascript
// In /bot/tests/integration.test.js
const { loadLatestData, loadHistoricalData } = require('../utils/dataLoader');

async function testGalaxyCommand() {
    const data = await loadLatestData();
    const historical = await loadHistoricalData(30);

    console.log('Testing galaxy visualization...');
    // Run galaxy logic here
    console.log('✅ Galaxy test passed');
}

testGalaxyCommand();
```

### User Acceptance Testing

1. Deploy to test server
2. Have users test each command
3. Gather feedback on:
   - Visual clarity
   - Information usefulness
   - Performance/speed
   - Shareability

## Step 5: Performance Optimization

### Caching Strategy

Create `/bot/utils/cache.js`:

```javascript
const NodeCache = require('node-cache');

// Cache for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

/**
 * Get cached data or compute
 * @param {string} key - Cache key
 * @param {Function} computeFn - Function to compute value if not cached
 * @returns {Promise<any>} Cached or computed value
 */
async function getCached(key, computeFn) {
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }

    const value = await computeFn();
    cache.set(key, value);
    return value;
}

module.exports = { getCached };
```

Usage in commands:

```javascript
const { getCached } = require('../utils/cache');

// In execute function
const galaxyData = await getCached(
    `galaxy-${days}`,
    async () => {
        const data = await loadLatestData();
        const historical = await loadHistoricalData(days);
        return processGalaxyData(data, historical);
    }
);
```

### Data Loading Optimization

```javascript
// Parallel loading
const [latestData, historicalData] = await Promise.all([
    loadLatestData(),
    loadHistoricalData(days)
]);
```

### Response Time Targets

- Simple commands (weather, galaxy): < 2 seconds
- Medium commands (journey, heatwave): < 3 seconds
- Complex commands (constellation, timeline): < 5 seconds

## Step 6: Error Handling

Implement consistent error handling:

```javascript
async execute(interaction) {
    await interaction.deferReply();

    try {
        // Command logic here

        // Validation
        if (!data || !data.artists || data.artists.length === 0) {
            return interaction.editReply({
                content: '❌ No artist data available.',
                ephemeral: true
            });
        }

        // Success response
        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error(`Error in /${this.data.name} command:`, error);

        // User-friendly error message
        await interaction.editReply({
            content: `❌ Something went wrong with the ${this.data.name} command. Please try again later.`,
            ephemeral: true
        });
    }
}
```

## Step 7: Documentation

### User Documentation

Create `/bot/COMMANDS.md`:

```markdown
# Casa 24 Discord Bot Commands

## Creative Visualizations

### /galaxy
View the Casa 24 collective as a galaxy of artists.
- **Usage**: `/galaxy [timeframe]`
- **Example**: `/galaxy timeframe:30d`

### /weather
Get an analytics weather forecast.
- **Usage**: `/weather [region] [forecast]`
- **Example**: `/weather region:Casa 24 forecast:7-day`

[... document each command]
```

### Developer Documentation

Update inline JSDoc comments:

```javascript
/**
 * Galaxy command - visualize artists as celestial bodies
 *
 * @module commands/galaxy
 * @requires discord.js
 * @requires utils/dataLoader
 * @requires utils/analytics
 *
 * @example
 * // In Discord
 * /galaxy timeframe:30d
 *
 * @returns {EmbedBuilder} Galaxy visualization embed
 */
```

## Step 8: Monitoring & Analytics

### Command Usage Tracking

```javascript
// In each command's execute function
const { logCommandUsage } = require('../utils/analytics');

await logCommandUsage(interaction.user.id, 'galaxy', {
    timeframe: days,
    timestamp: new Date()
});
```

### Performance Monitoring

```javascript
const startTime = Date.now();

// Command logic...

const executionTime = Date.now() - startTime;
console.log(`/galaxy executed in ${executionTime}ms`);

// Log if slow
if (executionTime > 3000) {
    console.warn(`Slow command: /galaxy took ${executionTime}ms`);
}
```

## Step 9: Deployment Checklist

- [ ] All commands implemented and tested
- [ ] Error handling in place
- [ ] Caching configured
- [ ] Documentation updated
- [ ] Commands registered with Discord
- [ ] Test server validation complete
- [ ] Performance benchmarks met
- [ ] User feedback collected
- [ ] Production deployment plan ready

## Step 10: Post-Launch

### Week 1 After Launch:
- Monitor usage metrics
- Fix critical bugs
- Gather user feedback
- Adjust visualizations based on feedback

### Month 1:
- Add requested features
- Optimize slow commands
- Create comparison charts
- Build analytics dashboard

### Ongoing:
- Monthly feature additions
- Quarterly visualization updates
- Continuous performance improvements
- Community-driven enhancements

## Troubleshooting

### Common Issues:

**Issue**: Commands timing out
**Solution**: Implement caching, optimize data queries

**Issue**: Embeds too long (>4096 characters)
**Solution**: Truncate output, paginate results

**Issue**: Visualizations don't align properly
**Solution**: Use code blocks, test in Discord's fixed-width font

**Issue**: Data not updating
**Solution**: Check cache TTL, verify data loader

## Resources

- Discord.js Documentation: https://discord.js.org
- Discord Developer Portal: https://discord.com/developers
- Unicode Characters: https://unicode-table.com
- Box Drawing: https://en.wikipedia.org/wiki/Box-drawing_character

## Support

For issues or questions:
- GitHub Issues: [Your repo URL]
- Discord: #bot-support channel
- Developer: @your-discord-handle

---

**Next Steps**: Start with /weather and /galaxy, then expand based on user demand!
