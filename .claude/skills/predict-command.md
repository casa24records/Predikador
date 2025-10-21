# Predict Command Skill

## Purpose
AI-powered metric prediction using linear regression to forecast future artist growth and provide data-driven insights.

## Command Name
`/predict`

## Key Features
- Linear regression prediction model
- Configurable prediction horizon (7-90 days)
- Confidence scoring based on R-squared values
- Predicts multiple metrics: Spotify followers, monthly listeners, Instagram followers
- Visual confidence bars (10-segment display)
- Purple-themed embeds for prediction aesthetics
- Flexible artist matching (case-insensitive, partial name matching)
- Disclaimer about prediction limitations

## Parameters
- **artist** (optional): Artist to predict for
  - Default: "Casa 24"
  - Supports partial name matching
  - Case-insensitive
- **days** (optional): Days ahead to predict
  - Min: 7 days
  - Max: 90 days
  - Default: 30 days

## Data Sources
- `data/latest.json` - Current baseline metrics
- `data/historical/*.json` - 90 days of historical data for model training

## Prediction Metrics

### 1. Spotify Followers
- Current follower count
- Predicted follower count
- Growth percentage
- Confidence score with visual bar

### 2. Monthly Listeners
- Current listener count
- Predicted listener count
- Growth percentage
- Confidence score with visual bar

### 3. Instagram Followers
- Current follower count
- Predicted follower count
- Growth percentage
- Confidence score with visual bar

## Prediction Model

### Linear Regression Algorithm
Uses `predictMetric(historicalData, artistName, platform, metric, daysAhead)`:

**Returns**:
```javascript
{
  available: boolean,
  current: number,
  predicted: number,
  growth: {
    absolute: number,
    percentage: number
  },
  confidence: number, // R-squared score (0-100)
  daysAhead: number
}
```

### Confidence Scoring
Based on R-squared (coefficient of determination):
- **90-100%**: Excellent - Highly reliable prediction
- **70-89%**: Good - Reliable with minor variance
- **50-69%**: Fair - Moderate reliability
- **30-49%**: Poor - High variance expected
- **0-29%**: Very Poor - Prediction highly uncertain

### Confidence Visual Bars
```
█████████░ 90%  (9/10 segments filled)
███████░░░ 70%  (7/10 segments filled)
█████░░░░░ 50%  (5/10 segments filled)
```

## Embed Styling
- Color: Purple (0x8c52ff) - distinctive prediction theme
- Title: "🔮 AI Prediction - {Artist Name}"
- Description: "Forecasting {X} days ahead using linear regression"
- Based on {X} days of historical data
- Footer: "Casa 24 Records - AI-powered predictions"
- Timestamp: Current time

## Data Requirements

### Minimum Historical Data
- **Required**: 7 days minimum
- **Recommended**: 30+ days for better accuracy
- **Optimal**: 90 days for highest confidence scores

### Data Quality Factors
- Consistent data collection (no gaps)
- Stable growth patterns (linear trends)
- Recent data more heavily weighted
- Outliers can affect prediction accuracy

## Common Modifications

### Adjusting Prediction Horizon
**Location**: Lines 16-20
- Change min value (currently 7 days)
- Change max value (currently 90 days)
- Default value (currently 30 days)

### Adding New Metrics to Predict
1. Call `predictMetric()` with new platform/metric
2. Check if prediction available
3. Format prediction display
4. Add field to embed with confidence bar

Example:
```javascript
const youtubePrediction = predictMetric(
  historicalData,
  artist.name,
  'youtube',
  'subscribers',
  daysAhead
);
```

### Modifying Confidence Bar Display
**Location**: Lines 72, 92, 112
- Change bar length: `/ 10` (currently 10 segments)
- Customize filled/empty characters
- Add color coding based on confidence level

### Customizing Disclaimer
**Location**: Lines 123-127
- Update prediction methodology description
- Add specific limitations
- Include recommended use cases

## Algorithm Details

### Linear Regression Formula
```
y = mx + b

Where:
- y = predicted value
- m = slope (growth rate)
- x = days ahead
- b = y-intercept (current value)
```

### R-Squared Calculation
Measures how well the linear model fits the data:
```
R² = 1 - (SS_res / SS_tot)

Where:
- SS_res = Sum of squared residuals
- SS_tot = Total sum of squares
```

## Troubleshooting

### Issue: "Need at least 7 days of historical data"
**Cause**: Insufficient historical data loaded
**Solution**:
- Wait for more data collection
- Check `data/historical/` directory has files
- Verify GitHub Actions data collection running

### Issue: Confidence scores very low (<30%)
**Cause**:
- Volatile growth patterns
- Data gaps or inconsistencies
- Recent dramatic changes
**Solution**:
- Use longer historical period
- Check for data anomalies
- Consider non-linear prediction models

### Issue: Predictions showing negative growth
**Cause**: Decreasing trend in historical data (legitimate)
**Solution**: System correctly predicts negative growth - not an error

### Issue: Artist not found
**Cause**: Name mismatch or typo
**Solution**:
- Check available artist names
- Use autocomplete in future
- Verify artist exists in data

### Issue: Prediction seems unrealistic
**Cause**:
- Linear model assumes constant growth rate
- External factors not accounted for
- Outliers in historical data
**Solution**:
- Check disclaimer warns about limitations
- Consider shorter prediction horizon
- Validate with actual results over time

## Utility Dependencies
- `predictMetric()` - Core prediction algorithm from analytics.js
- `formatNumber(num)` - Number formatting with commas
- `formatPercent(percent)` - Percentage formatting with +/- sign
- `loadLatestData()` - Current baseline data
- `loadHistoricalData(days)` - Historical data for model
- `getAllArtistNames()` - Artist name list

## Prediction Accuracy Tips

### Improving Accuracy
1. **Longer historical periods**: More data = better model
2. **Stable growth patterns**: Linear works best for consistent growth
3. **Recent data priority**: Weight recent data more heavily
4. **Remove outliers**: Filter anomalous data points
5. **Shorter prediction horizons**: Near-term more accurate than long-term

### When Predictions Work Best
- Steady, consistent growth trends
- No major upcoming changes (releases, promotions)
- Sufficient historical data (30+ days)
- Recent data shows linear pattern

### When Predictions May Be Inaccurate
- Viral moments or sudden spikes
- After major releases or promotions
- During platform algorithm changes
- With sparse or inconsistent data

## Optimization Tips
1. Cache prediction results for 24 hours
2. Implement multiple regression models (polynomial, exponential)
3. Add seasonality detection
4. Include external factors (release schedule, promotions)
5. Implement ensemble predictions (average multiple models)
6. Add prediction intervals (confidence ranges)
7. Track prediction accuracy over time
8. Auto-calibrate model based on past accuracy

## Future Enhancements
- Multiple prediction models (polynomial, exponential, ARIMA)
- Prediction intervals (range instead of single value)
- Factor in upcoming releases
- Include promotional campaign impacts
- Seasonal trend adjustment
- Prediction accuracy tracking
- Historical prediction vs. actual comparison
- Multi-metric combined predictions
- Scenario modeling ("what if" predictions)
- Automated model selection based on data pattern
- Machine learning model upgrades (neural networks)
- Real-time prediction updates
- Prediction alerts when milestones forecasted
