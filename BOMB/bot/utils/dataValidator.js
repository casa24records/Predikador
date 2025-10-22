/**
 * Data Validation Utility
 * Validates analytics data to detect corrupted or empty datasets
 */

/**
 * Check if a data object contains valid (non-zero) metrics
 * @param {Object} data - Data object to validate
 * @returns {Object} Validation result with details
 */
function validateData(data) {
  const result = {
    isValid: false,
    reason: '',
    details: {
      hasArtists: false,
      artistsWithData: 0,
      totalArtists: 0,
      platformStats: {
        spotify: 0,
        youtube: 0,
        instagram: 0
      }
    }
  };

  // Check basic structure
  if (!data || typeof data !== 'object') {
    result.reason = 'Data is null or not an object';
    return result;
  }

  if (!data.artists || !Array.isArray(data.artists)) {
    result.reason = 'Data has no artists array';
    return result;
  }

  if (data.artists.length === 0) {
    result.reason = 'Artists array is empty';
    return result;
  }

  result.details.hasArtists = true;
  result.details.totalArtists = data.artists.length;

  // Check if artists have valid data
  let artistsWithValidData = 0;

  for (const artist of data.artists) {
    if (!artist || typeof artist !== 'object') continue;

    let hasValidMetrics = false;

    // Check Spotify data
    if (artist.spotify) {
      const spotifyFollowers = artist.spotify.followers || 0;
      const spotifyListeners = parseInt(artist.spotify.monthly_listeners) || 0;

      if (spotifyFollowers > 0 || spotifyListeners > 0) {
        hasValidMetrics = true;
        result.details.platformStats.spotify++;
      }
    }

    // Check YouTube data
    if (artist.youtube) {
      const youtubeSubscribers = artist.youtube.subscribers || 0;
      const youtubeViews = artist.youtube.total_views || 0;

      if (youtubeSubscribers > 0 || youtubeViews > 0) {
        hasValidMetrics = true;
        result.details.platformStats.youtube++;
      }
    }

    // Check Instagram data
    if (artist.instagram) {
      const instagramFollowers = artist.instagram.followers || 0;

      if (instagramFollowers > 0) {
        hasValidMetrics = true;
        result.details.platformStats.instagram++;
      }
    }

    if (hasValidMetrics) {
      artistsWithValidData++;
    }
  }

  result.details.artistsWithData = artistsWithValidData;

  // Data is valid if at least one artist has non-zero metrics
  if (artistsWithValidData > 0) {
    result.isValid = true;
    result.reason = `Valid: ${artistsWithValidData}/${data.artists.length} artists have data`;
  } else {
    result.reason = `Invalid: All ${data.artists.length} artists have zero metrics across all platforms`;
  }

  return result;
}

/**
 * Calculate a data quality score (0-100)
 * @param {Object} data - Data object to score
 * @returns {number} Quality score
 */
function calculateDataQuality(data) {
  if (!data || !data.artists || data.artists.length === 0) {
    return 0;
  }

  const validation = validateData(data);
  if (!validation.isValid) {
    return 0;
  }

  const totalArtists = data.artists.length;
  const artistsWithData = validation.details.artistsWithData;
  const platformCoverage = Object.values(validation.details.platformStats).reduce((a, b) => a + b, 0);
  const maxPlatformCoverage = totalArtists * 3; // 3 platforms per artist

  // Calculate score based on:
  // - 50% artists with data
  // - 50% platform coverage
  const artistScore = (artistsWithData / totalArtists) * 50;
  const platformScore = (platformCoverage / maxPlatformCoverage) * 50;

  return Math.round(artistScore + platformScore);
}

/**
 * Check if data appears to be corrupted (all zeros/nulls)
 * @param {Object} data - Data object to check
 * @returns {boolean} True if data is corrupted
 */
function isDataCorrupted(data) {
  const validation = validateData(data);
  return !validation.isValid;
}

/**
 * Get a human-readable validation summary
 * @param {Object} data - Data object to summarize
 * @returns {string} Summary string
 */
function getValidationSummary(data) {
  const validation = validateData(data);
  const quality = calculateDataQuality(data);

  if (!validation.isValid) {
    return `❌ INVALID DATA: ${validation.reason}`;
  }

  const { artistsWithData, totalArtists, platformStats } = validation.details;
  const platformSummary = Object.entries(platformStats)
    .filter(([_, count]) => count > 0)
    .map(([platform, count]) => `${platform}: ${count}`)
    .join(', ');

  return `✅ VALID DATA (Quality: ${quality}%): ${artistsWithData}/${totalArtists} artists | ${platformSummary}`;
}

module.exports = {
  validateData,
  calculateDataQuality,
  isDataCorrupted,
  getValidationSummary
};
