const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * Load the latest analytics data (synchronous version for commands)
 * @returns {Object} Latest analytics data
 */
function loadLatestData() {
  try {
    // Support environment variable for custom data path (Railway/production)
    let dataPath = process.env.DATA_PATH
      ? path.resolve(process.env.DATA_PATH)
      : path.join(__dirname, '../../data/latest.json');

    // If path doesn't exist, try local copy in bot directory
    if (!fsSync.existsSync(dataPath)) {
      const localPath = path.join(__dirname, '../data/latest.json');
      if (fsSync.existsSync(localPath)) {
        console.log(`⚠️  Configured path not found, using local copy: ${localPath}`);
        dataPath = localPath;
      }
    }

    console.log(`Loading data from: ${dataPath}`);
    const data = fsSync.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading latest data:', error);
    throw new Error('Failed to load analytics data');
  }
}

/**
 * Load the latest analytics data (async version)
 * @returns {Promise<Object>} Latest analytics data
 */
async function loadLatestDataAsync() {
  try {
    // Support environment variable for custom data path (Railway/production)
    const dataPath = process.env.DATA_PATH
      ? path.resolve(process.env.DATA_PATH)
      : path.join(__dirname, '../../data/latest.json');

    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading latest data:', error);
    throw new Error('Failed to load analytics data');
  }
}

/**
 * Load historical data files (synchronous version for commands)
 * @param {number} days - Number of days to load
 * @returns {Array} Array of historical data objects
 */
function loadHistoricalData(days = 30) {
  try {
    // Support environment variable for custom data path (Railway/production)
    let historicalPath = process.env.HISTORICAL_DATA_PATH
      ? path.resolve(process.env.HISTORICAL_DATA_PATH)
      : path.join(__dirname, '../../data/historical');

    // If path doesn't exist, try local copy in bot directory
    if (!fsSync.existsSync(historicalPath)) {
      const localPath = path.join(__dirname, '../data/historical');
      if (fsSync.existsSync(localPath)) {
        console.log(`⚠️  Configured path not found, using local copy: ${localPath}`);
        historicalPath = localPath;
      }
    }

    console.log(`Loading historical data from: ${historicalPath}`);
    const files = fsSync.readdirSync(historicalPath);

    // Filter JSON files and sort by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, days);

    const historicalData = [];
    for (const file of jsonFiles) {
      const filePath = path.join(historicalPath, file);
      const content = fsSync.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      historicalData.push(data);
    }

    return historicalData;
  } catch (error) {
    console.error('Error loading historical data:', error);
    return [];
  }
}

/**
 * Load historical data files (async version)
 * @param {number} days - Number of days to load
 * @returns {Promise<Array>} Array of historical data objects
 */
async function loadHistoricalDataAsync(days = 30) {
  try {
    // Support environment variable for custom data path (Railway/production)
    const historicalPath = process.env.HISTORICAL_DATA_PATH
      ? path.resolve(process.env.HISTORICAL_DATA_PATH)
      : path.join(__dirname, '../../data/historical');

    const files = await fs.readdir(historicalPath);

    // Filter JSON files and sort by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, days);

    const historicalData = [];
    for (const file of jsonFiles) {
      const filePath = path.join(historicalPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      historicalData.push(data);
    }

    return historicalData;
  } catch (error) {
    console.error('Error loading historical data:', error);
    return [];
  }
}

/**
 * Get artist data by name
 * @param {Object} data - Latest data object
 * @param {string} artistName - Artist name to find
 * @returns {Object|null} Artist data or null if not found
 */
function getArtistByName(data, artistName) {
  if (!data.artists) return null;

  const normalizedSearch = artistName.toLowerCase().trim();
  return data.artists.find(artist =>
    artist.name.toLowerCase() === normalizedSearch ||
    artist.name.toLowerCase().includes(normalizedSearch)
  );
}

/**
 * Get all artist names
 * @param {Object} data - Latest data object
 * @returns {Array<string>} List of artist names
 */
function getAllArtistNames(data) {
  if (!data.artists) return [];
  return data.artists.map(a => a.name);
}

module.exports = {
  loadLatestData,
  loadLatestDataAsync,
  loadHistoricalData,
  loadHistoricalDataAsync,
  getArtistByName,
  getAllArtistNames
};
