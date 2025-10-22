const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { validateData, getValidationSummary, isDataCorrupted } = require('./dataValidator');

/**
 * Get all possible data file locations (in priority order)
 * @returns {Array<string>} Array of possible file paths
 */
function getPossibleDataPaths() {
  return [
    // 1. Environment variable (highest priority)
    process.env.DATA_PATH ? path.resolve(process.env.DATA_PATH) : null,

    // 2. Local copy in bot directory (Railway deployment)
    path.join(__dirname, '../data/latest.json'),

    // 3. Parent data directory (local development from bot/)
    path.join(__dirname, '../../data/latest.json'),

    // 4. Process CWD relative paths
    path.join(process.cwd(), 'data/latest.json'),
    path.join(process.cwd(), 'BOMB/data/latest.json'),
    path.join(process.cwd(), 'bot/data/latest.json'),

    // 5. Absolute paths from process CWD
    path.join(process.cwd(), '../data/latest.json'),
  ].filter(p => p !== null); // Remove null entries
}

/**
 * Get all possible historical data directory locations (in priority order)
 * @returns {Array<string>} Array of possible directory paths
 */
function getPossibleHistoricalPaths() {
  return [
    // 1. Environment variable (highest priority)
    process.env.HISTORICAL_DATA_PATH ? path.resolve(process.env.HISTORICAL_DATA_PATH) : null,

    // 2. Local copy in bot directory (Railway deployment)
    path.join(__dirname, '../data/historical'),

    // 3. Parent data directory (local development from bot/)
    path.join(__dirname, '../../data/historical'),

    // 4. Process CWD relative paths
    path.join(process.cwd(), 'data/historical'),
    path.join(process.cwd(), 'BOMB/data/historical'),
    path.join(process.cwd(), 'bot/data/historical'),

    // 5. Absolute paths from process CWD
    path.join(process.cwd(), '../data/historical'),
  ].filter(p => p !== null); // Remove null entries
}

/**
 * Find the first existing file from a list of possible paths
 * @param {Array<string>} paths - Array of possible file paths
 * @param {string} fileType - Description of file type for logging
 * @returns {string|null} The first existing path or null
 */
function findFirstExistingPath(paths, fileType) {
  console.log(`========================================`);
  console.log(`🔍 Searching for ${fileType}...`);
  console.log(`========================================`);

  for (let i = 0; i < paths.length; i++) {
    const testPath = paths[i];
    console.log(`   ${i + 1}. Testing: ${testPath}`);

    try {
      if (fsSync.existsSync(testPath)) {
        const stats = fsSync.statSync(testPath);

        if (stats.isFile()) {
          console.log(`   ✅ FOUND! File exists (${stats.size} bytes)`);
          console.log(`========================================`);
          return testPath;
        } else if (stats.isDirectory()) {
          const files = fsSync.readdirSync(testPath);
          console.log(`   ✅ FOUND! Directory exists (${files.length} items)`);
          console.log(`========================================`);
          return testPath;
        }
      } else {
        console.log(`   ❌ Does not exist`);
      }
    } catch (error) {
      console.log(`   ❌ Error checking path: ${error.message}`);
    }
  }

  console.log(`   ❌ NOT FOUND in any location`);
  console.log(`========================================`);
  return null;
}

/**
 * Find the most recent valid historical data file (synchronous)
 * @returns {Object|null} Object with {data, date, filePath} or null if none found
 */
function findLastValidHistoricalData() {
  const possiblePaths = getPossibleHistoricalPaths();
  const historicalPath = findFirstExistingPath(possiblePaths, 'historical directory (for fallback)');

  if (!historicalPath) {
    console.error('⚠️  No historical data directory found for fallback');
    return null;
  }

  try {
    const files = fsSync.readdirSync(historicalPath);

    // Get JSON files sorted by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    console.log(`🔍 Searching through ${jsonFiles.length} historical files for valid data...`);

    // Try each file until we find valid data
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(historicalPath, file);
        const content = fsSync.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Validate the data
        if (!isDataCorrupted(data)) {
          const date = file.replace('.json', '');
          console.log(`✅ Found valid historical data: ${date}`);
          console.log(`   ${getValidationSummary(data)}`);
          return { data, date, filePath };
        } else {
          console.log(`   ⚠️  Skipping ${file} - data is corrupted/empty`);
        }
      } catch (fileError) {
        console.error(`   ⚠️  Failed to read ${file}: ${fileError.message}`);
      }
    }

    console.error('❌ No valid historical data found in any file');
    return null;
  } catch (error) {
    console.error(`❌ Error searching historical data: ${error.message}`);
    return null;
  }
}

/**
 * Load the latest analytics data (synchronous version for commands)
 * @returns {Object} Latest analytics data
 */
function loadLatestData() {
  const possiblePaths = getPossibleDataPaths();
  const dataPath = findFirstExistingPath(possiblePaths, 'latest.json');

  if (!dataPath) {
    console.error('');
    console.error('========================================');
    console.error('❌ CRITICAL ERROR: No data file found!');
    console.error('========================================');
    console.error('Searched in these locations:');
    possiblePaths.forEach((p, i) => console.error(`   ${i + 1}. ${p}`));
    console.error('');
    console.error('Please ensure data files are deployed correctly.');
    console.error('========================================');
    throw new Error('Failed to load analytics data - no data file found');
  }

  try {
    console.log(`📖 Reading data from: ${dataPath}`);
    const data = fsSync.readFileSync(dataPath, 'utf-8');
    const parsed = JSON.parse(data);

    // Validate data structure
    if (!parsed.artists || !Array.isArray(parsed.artists)) {
      console.error('⚠️  Warning: Data file has unexpected structure');
    } else {
      console.log(`   Found ${parsed.artists.length} artists in file`);
    }

    // Validate data quality
    const validation = validateData(parsed);
    console.log(`   ${getValidationSummary(parsed)}`);

    if (isDataCorrupted(parsed)) {
      console.warn('');
      console.warn('========================================');
      console.warn('⚠️  WARNING: Latest data is corrupted!');
      console.warn('========================================');
      console.warn(`Reason: ${validation.reason}`);
      console.warn('Attempting to fall back to most recent valid historical data...');
      console.warn('========================================');

      const fallbackData = findLastValidHistoricalData();

      if (fallbackData) {
        console.log('');
        console.log('========================================');
        console.log('✅ FALLBACK SUCCESSFUL');
        console.log('========================================');
        console.log(`Using data from: ${fallbackData.date}`);
        console.log(`Source: ${fallbackData.filePath}`);
        console.log('Note: This is historical data, not today\'s data');
        console.log('Fix the data collection script to prevent this in the future');
        console.log('========================================');
        console.log('');

        // Add metadata to indicate this is fallback data
        fallbackData.data._fallback = {
          originalDate: parsed.date,
          fallbackDate: fallbackData.date,
          reason: 'Latest data was corrupted (all zeros/nulls)'
        };

        return fallbackData.data;
      } else {
        console.error('');
        console.error('========================================');
        console.error('❌ FALLBACK FAILED');
        console.error('========================================');
        console.error('No valid historical data available');
        console.error('Returning corrupted data as last resort');
        console.error('========================================');
        console.error('');
        return parsed; // Return corrupted data as last resort
      }
    }

    console.log(`✅ Successfully loaded valid data`);
    return parsed;
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ ERROR READING DATA FILE');
    console.error('========================================');
    console.error(`File path: ${dataPath}`);
    console.error(`Error: ${error.message}`);
    console.error('========================================');
    throw new Error(`Failed to read/parse analytics data: ${error.message}`);
  }
}

/**
 * Find the most recent valid historical data file (async)
 * @returns {Promise<Object|null>} Object with {data, date, filePath} or null if none found
 */
async function findLastValidHistoricalDataAsync() {
  const possiblePaths = getPossibleHistoricalPaths();

  let historicalPath = null;

  // Find historical directory
  for (const testPath of possiblePaths) {
    try {
      const stats = await fs.stat(testPath);
      if (stats.isDirectory()) {
        historicalPath = testPath;
        break;
      }
    } catch (error) {
      // Path doesn't exist, continue
    }
  }

  if (!historicalPath) {
    console.error('⚠️  No historical data directory found for fallback');
    return null;
  }

  try {
    const files = await fs.readdir(historicalPath);

    // Get JSON files sorted by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    console.log(`🔍 Searching through ${jsonFiles.length} historical files for valid data...`);

    // Try each file until we find valid data
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(historicalPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Validate the data
        if (!isDataCorrupted(data)) {
          const date = file.replace('.json', '');
          console.log(`✅ Found valid historical data: ${date}`);
          console.log(`   ${getValidationSummary(data)}`);
          return { data, date, filePath };
        } else {
          console.log(`   ⚠️  Skipping ${file} - data is corrupted/empty`);
        }
      } catch (fileError) {
        console.error(`   ⚠️  Failed to read ${file}: ${fileError.message}`);
      }
    }

    console.error('❌ No valid historical data found in any file');
    return null;
  } catch (error) {
    console.error(`❌ Error searching historical data: ${error.message}`);
    return null;
  }
}

/**
 * Load the latest analytics data (async version)
 * @returns {Promise<Object>} Latest analytics data
 */
async function loadLatestDataAsync() {
  const possiblePaths = getPossibleDataPaths();

  console.log(`========================================`);
  console.log(`🔍 Searching for latest.json (async)...`);
  console.log(`========================================`);

  // Try each path
  for (let i = 0; i < possiblePaths.length; i++) {
    const testPath = possiblePaths[i];
    console.log(`   ${i + 1}. Testing: ${testPath}`);

    try {
      // Check if file exists
      const stats = await fs.stat(testPath);

      if (stats.isFile()) {
        console.log(`   ✅ FOUND! File exists (${stats.size} bytes)`);
        console.log(`========================================`);
        console.log(`📖 Reading data from: ${testPath}`);

        const data = await fs.readFile(testPath, 'utf-8');
        const parsed = JSON.parse(data);

        // Validate data structure
        if (!parsed.artists || !Array.isArray(parsed.artists)) {
          console.error('⚠️  Warning: Data file has unexpected structure');
        } else {
          console.log(`   Found ${parsed.artists.length} artists in file`);
        }

        // Validate data quality
        const validation = validateData(parsed);
        console.log(`   ${getValidationSummary(parsed)}`);

        if (isDataCorrupted(parsed)) {
          console.warn('');
          console.warn('========================================');
          console.warn('⚠️  WARNING: Latest data is corrupted!');
          console.warn('========================================');
          console.warn(`Reason: ${validation.reason}`);
          console.warn('Attempting to fall back to most recent valid historical data...');
          console.warn('========================================');

          const fallbackData = await findLastValidHistoricalDataAsync();

          if (fallbackData) {
            console.log('');
            console.log('========================================');
            console.log('✅ FALLBACK SUCCESSFUL');
            console.log('========================================');
            console.log(`Using data from: ${fallbackData.date}`);
            console.log(`Source: ${fallbackData.filePath}`);
            console.log('Note: This is historical data, not today\'s data');
            console.log('Fix the data collection script to prevent this in the future');
            console.log('========================================');
            console.log('');

            // Add metadata to indicate this is fallback data
            fallbackData.data._fallback = {
              originalDate: parsed.date,
              fallbackDate: fallbackData.date,
              reason: 'Latest data was corrupted (all zeros/nulls)'
            };

            return fallbackData.data;
          } else {
            console.error('');
            console.error('========================================');
            console.error('❌ FALLBACK FAILED');
            console.error('========================================');
            console.error('No valid historical data available');
            console.error('Returning corrupted data as last resort');
            console.error('========================================');
            console.error('');
            return parsed; // Return corrupted data as last resort
          }
        }

        console.log(`✅ Successfully loaded valid data`);
        return parsed;
      } else {
        console.log(`   ❌ Path exists but is not a file`);
      }
    } catch (error) {
      console.log(`   ❌ ${error.code === 'ENOENT' ? 'Does not exist' : error.message}`);
    }
  }

  // No file found
  console.log(`   ❌ NOT FOUND in any location`);
  console.log(`========================================`);
  console.error('');
  console.error('========================================');
  console.error('❌ CRITICAL ERROR: No data file found!');
  console.error('========================================');
  console.error('Searched in these locations:');
  possiblePaths.forEach((p, i) => console.error(`   ${i + 1}. ${p}`));
  console.error('');
  console.error('Please ensure data files are deployed correctly.');
  console.error('========================================');
  throw new Error('Failed to load analytics data - no data file found');
}

/**
 * Load historical data files (synchronous version for commands)
 * @param {number} days - Number of days to load
 * @returns {Array} Array of historical data objects
 */
function loadHistoricalData(days = 30) {
  const possiblePaths = getPossibleHistoricalPaths();
  const historicalPath = findFirstExistingPath(possiblePaths, 'historical directory');

  if (!historicalPath) {
    console.error('');
    console.error('========================================');
    console.error('⚠️  WARNING: No historical data found!');
    console.error('========================================');
    console.error('Searched in these locations:');
    possiblePaths.forEach((p, i) => console.error(`   ${i + 1}. ${p}`));
    console.error('');
    console.error('Historical data features will not be available.');
    console.error('========================================');
    return [];
  }

  try {
    console.log(`📚 Loading historical data from: ${historicalPath}`);
    const files = fsSync.readdirSync(historicalPath);

    // Filter JSON files and sort by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, days);

    console.log(`   Found ${jsonFiles.length} historical files (requesting ${days} days)`);

    const historicalData = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(historicalPath, file);
        const content = fsSync.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        historicalData.push(data);
        successCount++;
      } catch (fileError) {
        console.error(`   ⚠️  Failed to load ${file}: ${fileError.message}`);
        errorCount++;
      }
    }

    console.log(`✅ Loaded ${successCount} historical files successfully`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} files failed to load`);
    }

    return historicalData;
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ ERROR LOADING HISTORICAL DATA');
    console.error('========================================');
    console.error(`Directory: ${historicalPath}`);
    console.error(`Error: ${error.message}`);
    console.error('========================================');
    return [];
  }
}

/**
 * Load historical data files (async version)
 * @param {number} days - Number of days to load
 * @returns {Promise<Array>} Array of historical data objects
 */
async function loadHistoricalDataAsync(days = 30) {
  const possiblePaths = getPossibleHistoricalPaths();

  console.log(`========================================`);
  console.log(`🔍 Searching for historical directory (async)...`);
  console.log(`========================================`);

  let historicalPath = null;

  // Try each path
  for (let i = 0; i < possiblePaths.length; i++) {
    const testPath = possiblePaths[i];
    console.log(`   ${i + 1}. Testing: ${testPath}`);

    try {
      const stats = await fs.stat(testPath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(testPath);
        console.log(`   ✅ FOUND! Directory exists (${files.length} items)`);
        console.log(`========================================`);
        historicalPath = testPath;
        break;
      } else {
        console.log(`   ❌ Path exists but is not a directory`);
      }
    } catch (error) {
      console.log(`   ❌ ${error.code === 'ENOENT' ? 'Does not exist' : error.message}`);
    }
  }

  if (!historicalPath) {
    console.log(`   ❌ NOT FOUND in any location`);
    console.log(`========================================`);
    console.error('');
    console.error('========================================');
    console.error('⚠️  WARNING: No historical data found!');
    console.error('========================================');
    console.error('Searched in these locations:');
    possiblePaths.forEach((p, i) => console.error(`   ${i + 1}. ${p}`));
    console.error('');
    console.error('Historical data features will not be available.');
    console.error('========================================');
    return [];
  }

  try {
    console.log(`📚 Loading historical data from: ${historicalPath}`);
    const files = await fs.readdir(historicalPath);

    // Filter JSON files and sort by date (newest first)
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, days);

    console.log(`   Found ${jsonFiles.length} historical files (requesting ${days} days)`);

    const historicalData = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(historicalPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        historicalData.push(data);
        successCount++;
      } catch (fileError) {
        console.error(`   ⚠️  Failed to load ${file}: ${fileError.message}`);
        errorCount++;
      }
    }

    console.log(`✅ Loaded ${successCount} historical files successfully`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} files failed to load`);
    }

    return historicalData;
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ ERROR LOADING HISTORICAL DATA');
    console.error('========================================');
    console.error(`Directory: ${historicalPath}`);
    console.error(`Error: ${error.message}`);
    console.error('========================================');
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
