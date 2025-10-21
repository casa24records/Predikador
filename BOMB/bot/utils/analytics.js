/**
 * Calculate growth between two data points
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Growth data with absolute and percentage
 */
function calculateGrowth(current, previous) {
  const absolute = current - previous;
  const percentage = previous > 0 ? ((absolute / previous) * 100) : 0;

  return {
    absolute,
    percentage,
    emoji: absolute > 0 ? '📈' : absolute < 0 ? '📉' : '➡️'
  };
}

/**
 * Calculate platform-specific growth from historical data
 * @param {Array} historicalData - Historical data array
 * @param {string} artistName - Artist name
 * @param {string} platform - Platform (spotify, youtube, instagram)
 * @param {string} metric - Metric name
 * @returns {Object} Growth statistics
 */
function calculatePlatformGrowth(historicalData, artistName, platform, metric) {
  if (!historicalData || historicalData.length < 2) {
    return { available: false };
  }

  try {
    // Get latest and oldest data points
    const latest = historicalData[0];
    const oldest = historicalData[historicalData.length - 1];

    // Find artist in both datasets
    const latestArtist = latest.artists?.find(a => a.name === artistName);
    const oldestArtist = oldest.artists?.find(a => a.name === artistName);

    if (!latestArtist || !oldestArtist) {
      return { available: false };
    }

    // Get metric values
    let latestValue = latestArtist[platform]?.[metric];
    let oldestValue = oldestArtist[platform]?.[metric];

    // Handle string values (like monthly_listeners)
    if (typeof latestValue === 'string') latestValue = parseInt(latestValue) || 0;
    if (typeof oldestValue === 'string') oldestValue = parseInt(oldestValue) || 0;

    if (latestValue === undefined || oldestValue === undefined) {
      return { available: false };
    }

    const growth = calculateGrowth(latestValue, oldestValue);

    return {
      available: true,
      current: latestValue,
      previous: oldestValue,
      growth,
      days: historicalData.length
    };
  } catch (error) {
    console.error('Error calculating growth:', error);
    return { available: false };
  }
}

/**
 * Simple linear prediction (very basic forecasting)
 * @param {Array} historicalData - Historical data array
 * @param {string} artistName - Artist name
 * @param {string} platform - Platform
 * @param {string} metric - Metric name
 * @param {number} daysAhead - Days to predict ahead
 * @returns {Object} Prediction data
 */
function predictMetric(historicalData, artistName, platform, metric, daysAhead = 30) {
  if (!historicalData || historicalData.length < 7) {
    return { available: false, reason: 'Need at least 7 days of data' };
  }

  try {
    // Extract time series
    const values = [];
    for (let i = historicalData.length - 1; i >= 0; i--) {
      const artist = historicalData[i].artists?.find(a => a.name === artistName);
      if (artist && artist[platform]?.[metric] !== undefined) {
        let value = artist[platform][metric];
        if (typeof value === 'string') value = parseInt(value) || 0;
        values.push(value);
      }
    }

    if (values.length < 7) {
      return { available: false, reason: 'Insufficient data points' };
    }

    // Calculate linear regression (simple slope)
    const n = values.length;
    const sumX = (n * (n + 1)) / 2; // Sum of 1 to n
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + y * (i + 1), 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict future value
    const futureX = n + daysAhead;
    const prediction = Math.max(0, Math.round(slope * futureX + intercept));
    const current = values[values.length - 1];

    const growth = calculateGrowth(prediction, current);

    // Calculate confidence (based on R-squared, simplified)
    const mean = sumY / n;
    const ssTotal = values.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0);
    const ssResidual = values.reduce((sum, y, i) => {
      const predicted = slope * (i + 1) + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const rSquared = 1 - (ssResidual / ssTotal);
    const confidence = Math.max(0, Math.min(100, rSquared * 100));

    return {
      available: true,
      current,
      predicted: prediction,
      growth,
      daysAhead,
      confidence: Math.round(confidence),
      dataPoints: n
    };
  } catch (error) {
    console.error('Error predicting metric:', error);
    return { available: false, reason: 'Calculation error' };
  }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString('en-US');
}

/**
 * Format percentage
 * @param {number} percent - Percentage value
 * @returns {string} Formatted percentage
 */
function formatPercent(percent) {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

module.exports = {
  calculateGrowth,
  calculatePlatformGrowth,
  predictMetric,
  formatNumber,
  formatPercent
};
