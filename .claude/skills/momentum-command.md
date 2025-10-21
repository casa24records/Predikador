# Momentum Command Skill

## Purpose
The momentum command detects and analyzes growth patterns, acceleration trends, and breakout moments across social media platforms. It provides a comprehensive momentum score (0-100) with actionable insights and personalized recommendations to help artists understand and capitalize on their growth trajectory.

## Command Name
`/momentum`

## Key Features
- **Multi-Period Analysis**: Tracks growth across 4 time windows
  - 7-day period (weekly momentum)
  - 14-day period (bi-weekly trends)
  - 30-day period (monthly patterns)
  - 60-day period (long-term trajectory)
- **Momentum Scoring**: Comprehensive 0-100 point system
  - 30 points: Velocity state assessment
  - 20 points: Acceleration component
  - 20 points: Breakout detection
  - 30 points: Consistency and trend strength
- **4 Velocity States**: Categorizes growth patterns
  - **Accelerating**: Growth rate increasing over time
  - **Steady**: Consistent, stable growth
  - **Decelerating**: Growth rate slowing down
  - **Volatile**: Unpredictable, fluctuating growth
- **Platform-Specific Analysis**: Individual velocity tracking for each platform
  - Spotify (listeners & followers)
  - YouTube (subscribers)
  - Instagram (followers)
- **Breakout Detection**: Identifies exceptional growth (3x+ normal rate)
- **Personalized Recommendations**: Context-aware suggestions based on momentum score and velocity state

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `artist` | String | Yes | Artist name or ID to analyze |
| `period` | String Choice | No | Time period to focus on (default: 30 days) |

### Period Options:
- `7d` - Last 7 days (weekly momentum)
- `14d` - Last 14 days (bi-weekly)
- `30d` - Last 30 days (monthly, default)
- `60d` - Last 60 days (long-term)
- `all` - Comprehensive view across all periods

## Data Sources

### Primary Data Files
- **Time-Series Metrics Database**: Daily snapshots of all platform metrics
  - Minimum 60 days of historical data required
  - Recommended: 90+ days for accurate trend analysis
- **Growth Rate Calculations**: Pre-computed or calculated on-demand
  - Daily growth rates
  - Weekly averages
  - Monthly trends
- **Baseline Metrics**: Artist's typical growth rate for breakout detection
  - Rolling 30-day average
  - Standard deviation calculations

### Data Requirements
- Minimum 7 days for basic momentum score
- 30 days recommended for accurate acceleration detection
- 60+ days required for long-term trend analysis
- Daily granularity for precise breakout identification

## Common Modifications

### Adjusting Momentum Score Weights
```javascript
// Current scoring breakdown (total: 100 points)
const SCORE_WEIGHTS = {
  velocityState: 30,    // Based on growth pattern
  acceleration: 20,     // Rate of change
  breakouts: 20,        // Exceptional growth events
  consistency: 30       // Trend stability
};

// Example: Emphasize recent acceleration
const SCORE_WEIGHTS = {
  velocityState: 25,
  acceleration: 30,     // Increased from 20
  breakouts: 20,
  consistency: 25       // Decreased from 30
};
```

### Modifying Velocity State Thresholds
```javascript
// Current acceleration thresholds
const VELOCITY_THRESHOLDS = {
  accelerating: 1.2,    // 20%+ increase in growth rate
  steady: 0.9,          // Within ±10% of baseline
  decelerating: 0.7,    // 30%+ decrease in growth rate
  volatile: null        // High variance (coefficient > 0.5)
};

// More sensitive detection
const VELOCITY_THRESHOLDS = {
  accelerating: 1.1,    // 10%+ increase
  steady: 0.95,         // Within ±5%
  decelerating: 0.8,    // 20%+ decrease
  volatile: null
};
```

### Changing Breakout Detection Multiplier
```javascript
// Current: 3x normal growth rate
const BREAKOUT_MULTIPLIER = 3.0;

// More sensitive (detects smaller surges)
const BREAKOUT_MULTIPLIER = 2.0;

// More conservative (only major breakouts)
const BREAKOUT_MULTIPLIER = 5.0;
```

### Adjusting Time Period Windows
```javascript
// Current periods
const PERIODS = {
  short: 7,
  medium: 14,
  standard: 30,
  long: 60
};

// Longer analysis windows
const PERIODS = {
  short: 14,
  medium: 30,
  standard: 60,
  long: 90
};
```

### Customizing Recommendation Messages
```javascript
// Current recommendations by momentum score
const RECOMMENDATIONS = {
  high: [  // 80-100 score
    "🚀 Capitalize on momentum with consistent content releases",
    "📢 Increase promotional efforts while engagement is high",
    "🤝 Leverage momentum for collaboration opportunities"
  ],
  medium: [  // 50-79 score
    "📈 Focus on consistency to maintain steady growth",
    "🎯 Identify and replicate successful content patterns",
    "💡 Experiment with new content formats"
  ],
  low: [  // 0-49 score
    "🔄 Review and refresh content strategy",
    "🎨 Focus on quality over quantity",
    "📊 Analyze what worked in higher-momentum periods"
  ]
};

// Add velocity-specific recommendations
const VELOCITY_RECOMMENDATIONS = {
  accelerating: "Ride the wave! Keep doing what's working.",
  steady: "Maintain consistency while exploring growth opportunities.",
  decelerating: "Identify recent changes and consider strategy adjustments.",
  volatile: "Focus on consistency to stabilize growth patterns."
};
```

### Modifying Consistency Calculation
```javascript
// Current: Coefficient of variation (CV)
const consistency = standardDeviation / mean;
const consistencyScore = Math.max(0, 30 * (1 - consistency));

// Alternative: Penalize gaps in growth
const consistencyScore = calculateConsistencyWithGapPenalty(growthRates);

function calculateConsistencyWithGapPenalty(rates) {
  const cv = calculateCV(rates);
  const gapCount = rates.filter(r => r === 0).length;
  const gapPenalty = (gapCount / rates.length) * 10;
  return Math.max(0, 30 * (1 - cv) - gapPenalty);
}
```

### Adjusting Visualization Colors
```javascript
// Current momentum score colors
const MOMENTUM_COLORS = {
  high: 0x00FF00,      // Green (80-100)
  medium: 0xFFFF00,    // Yellow (50-79)
  low: 0xFF6600,       // Orange (30-49)
  critical: 0xFF0000   // Red (0-29)
};

// Custom color scheme
const MOMENTUM_COLORS = {
  high: 0x1DB954,      // Spotify green
  medium: 0x4A9EFF,    // Blue
  low: 0xFFA500,       // Orange
  critical: 0x8B0000   // Dark red
};
```

## Troubleshooting

### Issue: Momentum score is always low
**Symptoms**: Score consistently below 30 even with visible growth
**Solutions**:
1. Verify historical data is being fetched correctly
2. Check if baseline metrics are calculated properly
3. Ensure growth rates are using correct time deltas
4. Review score weight distribution (may be too conservative)
5. Validate that all score components are contributing

**Debug Check**:
```javascript
console.log('Score breakdown:', {
  velocity: velocityScore,
  acceleration: accelerationScore,
  breakouts: breakoutScore,
  consistency: consistencyScore,
  total: totalScore
});
```

### Issue: Velocity state incorrectly identified
**Symptoms**: Clearly accelerating artist marked as "steady" or vice versa
**Solutions**:
1. Check acceleration calculation (comparing recent vs baseline)
2. Verify sufficient data points for trend detection (minimum 14 days)
3. Review threshold values (may need tuning for artist scale)
4. Ensure baseline period is appropriate (30-day average)
5. Check for data anomalies (outliers, missing days)

**Calculation Validation**:
```javascript
console.log('Velocity analysis:', {
  recentGrowthRate: recentRate,
  baselineGrowthRate: baselineRate,
  ratio: recentRate / baselineRate,
  state: velocityState,
  threshold: VELOCITY_THRESHOLDS.accelerating
});
```

### Issue: No breakouts detected when there should be
**Symptoms**: Obvious growth spikes not flagged as breakouts
**Solutions**:
1. Lower BREAKOUT_MULTIPLIER threshold (try 2.0 instead of 3.0)
2. Check baseline calculation (may be skewed by previous breakouts)
3. Verify daily growth rates are calculated correctly
4. Ensure breakout detection is checking all time periods
5. Review data quality for the spike period

**Breakout Detection Debug**:
```javascript
dailyGrowthRates.forEach((rate, index) => {
  if (rate > baselineRate * BREAKOUT_MULTIPLIER) {
    console.log(`Breakout detected on day ${index}: ${rate} vs baseline ${baselineRate}`);
  }
});
```

### Issue: Volatile state assigned too frequently
**Symptoms**: Most artists showing as "volatile" instead of other states
**Solutions**:
1. Increase coefficient of variation threshold
2. Check if data has too many outliers (needs cleaning)
3. Consider using median instead of mean for baseline
4. Implement outlier filtering before variance calculation
5. Adjust volatility detection to require sustained variance

**Variance Analysis**:
```javascript
console.log('Volatility metrics:', {
  mean: meanGrowth,
  stdDev: standardDeviation,
  coefficientOfVariation: cv,
  threshold: VOLATILITY_THRESHOLD
});
```

### Issue: Platform-specific velocity missing
**Symptoms**: Overall momentum shown but not per-platform breakdown
**Solutions**:
1. Verify platform-specific data queries are executing
2. Check if all platforms have sufficient historical data
3. Ensure platform velocity calculation loop is complete
4. Validate platform metric names match database schema
5. Add fallback for platforms with insufficient data

**Platform Check**:
```javascript
const platforms = ['spotify_listeners', 'spotify_followers', 'youtube_subs', 'instagram'];
platforms.forEach(platform => {
  console.log(`${platform}: ${platformData[platform]?.length || 0} data points`);
});
```

### Issue: Recommendations not relevant to velocity state
**Symptoms**: Generic recommendations despite specific growth patterns
**Solutions**:
1. Check if velocity state is being passed to recommendation engine
2. Verify recommendation mapping includes all states
3. Ensure recommendation selection logic is working
4. Add more specific recommendations for each state
5. Consider momentum score ranges within each state

**Recommendation Logic**:
```javascript
function getRecommendations(score, velocity, platform) {
  // Combine score and velocity for targeted advice
  if (score > 80 && velocity === 'accelerating') {
    return RECOMMENDATIONS.highAccelerating;
  } else if (score < 30 && velocity === 'decelerating') {
    return RECOMMENDATIONS.lowDecelerating;
  }
  // ... more combinations
}
```

### Issue: Acceleration score seems inverted
**Symptoms**: Decelerating artists getting high acceleration scores
**Solutions**:
1. Check if acceleration is calculated as absolute value (should be signed)
2. Verify positive acceleration increases score, negative decreases it
3. Ensure acceleration formula is correct (second derivative)
4. Review time period comparisons (recent vs baseline)
5. Check for sign errors in calculations

**Fix Example**:
```javascript
// Correct: Positive acceleration increases score
const accelerationScore = Math.max(0, 20 * (1 + accelerationRatio));

// Wrong: Treats deceleration same as acceleration
const accelerationScore = Math.abs(accelerationRatio) * 20;
```

### Issue: Consistency score always near zero
**Symptoms**: Even stable growth showing low consistency scores
**Solutions**:
1. Check if standard deviation calculation is correct
2. Verify mean is not near zero (causing division issues)
3. Review normalization of consistency metric
4. Ensure sufficient data points for variance calculation (minimum 7)
5. Consider using different consistency metric (e.g., trend R-squared)

**Alternative Consistency Metric**:
```javascript
// Use linear regression R-squared instead of CV
const rSquared = calculateRSquared(timePoints, growthRates);
const consistencyScore = rSquared * 30;  // High R² = consistent trend
```

### Issue: Command timeout for long-term analysis
**Symptoms**: 60-day or "all periods" analysis times out
**Solutions**:
1. Implement caching for momentum calculations (TTL: 6-12 hours)
2. Pre-calculate daily growth rates during data ingestion
3. Use Discord defer() to extend response time
4. Optimize database queries with proper indexes
5. Consider async processing for complex analyses

**Performance Optimization**:
```javascript
// Cache momentum scores
const cacheKey = `momentum:${artistId}:${period}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;

// Calculate and cache
const momentum = await calculateMomentum(artistId, period);
await cache.set(cacheKey, momentum, 6 * 60 * 60); // 6 hour TTL
```

## Performance Considerations
- **Response Time Target**: < 3 seconds for 30-day analysis
- **Data Processing**: Pre-calculate growth rates during daily updates
- **Caching Strategy**:
  - Cache momentum scores for 6-12 hours
  - Invalidate cache on new data ingestion
  - Per-artist, per-period cache keys
- **Database Optimization**:
  - Index on (artist_id, date, metric_type)
  - Consider materialized views for common calculations
- **Calculation Complexity**: O(n) where n = days analyzed (keep n ≤ 90)

## Future Enhancement Ideas
- Momentum alerts (notify when crossing thresholds)
- Comparative momentum (vs similar artists or genre average)
- Momentum forecasting (predict next period's score)
- Event correlation (link momentum changes to releases/campaigns)
- Platform-specific recommendations (tailored to Instagram vs Spotify growth)
- Momentum leaderboard (top gaining artists this period)
- Historical momentum timeline visualization
- Export momentum reports as PDF/image
- A/B testing recommendations based on momentum state
