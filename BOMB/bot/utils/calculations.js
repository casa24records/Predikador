/**
 * Shared calculation utilities for growth metrics and statistics
 * This module provides reusable functions to reduce code duplication across commands
 */

/**
 * Calculate growth between current and historical artist data
 * @param {Object} currentArtist - Current artist data
 * @param {Object} oldArtist - Historical artist data
 * @param {string} metric - Metric to calculate growth for (e.g., 'spotify-followers', 'youtube-subs')
 * @returns {number|null} Growth percentage or null if not calculable
 */
function calculateGrowth(currentArtist, oldArtist, metric) {
    if (!currentArtist || !oldArtist) {
        return null;
    }

    let currentValue = 0;
    let oldValue = 0;

    switch (metric) {
        case 'spotify-listeners':
            currentValue = parseInt(currentArtist.spotify?.monthly_listeners) || 0;
            oldValue = parseInt(oldArtist.spotify?.monthly_listeners) || 0;
            break;

        case 'spotify-followers':
            currentValue = currentArtist.spotify?.followers || 0;
            oldValue = oldArtist.spotify?.followers || 0;
            break;

        case 'youtube-subs':
            currentValue = currentArtist.youtube?.subscribers || 0;
            oldValue = oldArtist.youtube?.subscribers || 0;
            break;

        case 'youtube-views':
            currentValue = currentArtist.youtube?.total_views || 0;
            oldValue = oldArtist.youtube?.total_views || 0;
            break;

        case 'instagram-followers':
            currentValue = currentArtist.instagram?.followers || 0;
            oldValue = oldArtist.instagram?.followers || 0;
            break;

        case 'total-reach':
        case 'total':
            currentValue = (currentArtist.spotify?.followers || 0) +
                          (currentArtist.youtube?.subscribers || 0) +
                          (currentArtist.instagram?.followers || 0);
            oldValue = (oldArtist.spotify?.followers || 0) +
                      (oldArtist.youtube?.subscribers || 0) +
                      (oldArtist.instagram?.followers || 0);
            break;

        default:
            return null;
    }

    if (oldValue === 0) {
        return null;
    }

    return ((currentValue - oldValue) / oldValue) * 100;
}

/**
 * Calculate absolute growth (difference) between current and historical values
 * @param {Object} currentArtist - Current artist data
 * @param {Object} oldArtist - Historical artist data
 * @param {string} metric - Metric to calculate growth for
 * @returns {number} Absolute growth value
 */
function calculateAbsoluteGrowth(currentArtist, oldArtist, metric) {
    if (!currentArtist || !oldArtist) {
        return 0;
    }

    let currentValue = 0;
    let oldValue = 0;

    switch (metric) {
        case 'spotify-listeners':
            currentValue = parseInt(currentArtist.spotify?.monthly_listeners) || 0;
            oldValue = parseInt(oldArtist.spotify?.monthly_listeners) || 0;
            break;

        case 'spotify-followers':
            currentValue = currentArtist.spotify?.followers || 0;
            oldValue = oldArtist.spotify?.followers || 0;
            break;

        case 'youtube-subs':
            currentValue = currentArtist.youtube?.subscribers || 0;
            oldValue = oldArtist.youtube?.subscribers || 0;
            break;

        case 'youtube-views':
            currentValue = currentArtist.youtube?.total_views || 0;
            oldValue = oldArtist.youtube?.total_views || 0;
            break;

        case 'instagram-followers':
            currentValue = currentArtist.instagram?.followers || 0;
            oldValue = oldArtist.instagram?.followers || 0;
            break;

        case 'total-reach':
        case 'total':
            currentValue = (currentArtist.spotify?.followers || 0) +
                          (currentArtist.youtube?.subscribers || 0) +
                          (currentArtist.instagram?.followers || 0);
            oldValue = (oldArtist.spotify?.followers || 0) +
                      (oldArtist.youtube?.subscribers || 0) +
                      (oldArtist.instagram?.followers || 0);
            break;

        default:
            return 0;
    }

    return currentValue - oldValue;
}

/**
 * Calculate total reach across all platforms
 * @param {Object} artist - Artist data
 * @returns {number} Total followers/subscribers across all platforms
 */
function calculateTotalReach(artist) {
    if (!artist) {
        return 0;
    }

    return (artist.spotify?.followers || 0) +
           (artist.youtube?.subscribers || 0) +
           (artist.instagram?.followers || 0);
}

/**
 * Get metric value from artist data
 * @param {Object} artist - Artist data
 * @param {string} metric - Metric name
 * @returns {number} Metric value
 */
function getMetricValue(artist, metric) {
    if (!artist) {
        return 0;
    }

    switch (metric) {
        case 'spotify-listeners':
            return parseInt(artist.spotify?.monthly_listeners) || 0;

        case 'spotify-followers':
            return artist.spotify?.followers || 0;

        case 'youtube-subs':
            return artist.youtube?.subscribers || 0;

        case 'youtube-views':
            return artist.youtube?.total_views || 0;

        case 'instagram-followers':
            return artist.instagram?.followers || 0;

        case 'total-reach':
        case 'total':
            return calculateTotalReach(artist);

        default:
            return 0;
    }
}

module.exports = {
    calculateGrowth,
    calculateAbsoluteGrowth,
    calculateTotalReach,
    getMetricValue
};
