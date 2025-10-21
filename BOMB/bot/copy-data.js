// Bulletproof data copy script for Railway deployment
// Works regardless of deployment directory structure
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('📦 BULLETPROOF DATA COPY SCRIPT');
console.log('========================================');
console.log(`Current directory: ${__dirname}`);
console.log(`Process CWD: ${process.cwd()}`);
console.log('');

// Define all possible source locations (in priority order)
const possibleSources = [
  path.join(__dirname, '../data'),           // BOMB/data (when deployed from BOMB/bot)
  path.join(__dirname, '../../data'),        // data (when deployed from bot subdirectory)
  path.join(process.cwd(), 'data'),          // data (relative to process CWD)
  path.join(process.cwd(), 'BOMB/data'),     // BOMB/data (relative to process CWD)
  path.join(process.cwd(), '../data'),       // ../data (relative to process CWD)
];

const destData = path.join(__dirname, 'data');

console.log('🔍 Searching for source data in these locations (in order):');
possibleSources.forEach((src, idx) => {
  console.log(`   ${idx + 1}. ${src}`);
});
console.log('');

// Function to copy directory recursively
function copyDir(src, dest) {
  console.log(`   📁 Copying directory: ${path.basename(src)}`);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`   ✓ Created destination: ${dest}`);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  let fileCount = 0;
  let dirCount = 0;

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      dirCount++;
      copyDir(srcPath, destPath);
    } else {
      fileCount++;
      fs.copyFileSync(srcPath, destPath);
      const stats = fs.statSync(destPath);
      console.log(`   ✓ Copied: ${entry.name} (${stats.size} bytes)`);
    }
  }

  if (fileCount > 0 || dirCount > 0) {
    console.log(`   📊 Summary: ${fileCount} file(s), ${dirCount} subdirectory(ies)`);
  }
}

// Function to verify data integrity
function verifyData(dataDir) {
  console.log('');
  console.log('🔍 Verifying data integrity...');

  const latestJson = path.join(dataDir, 'latest.json');
  const historicalDir = path.join(dataDir, 'historical');
  let isValid = true;

  // Check latest.json
  if (fs.existsSync(latestJson)) {
    const stats = fs.statSync(latestJson);
    console.log(`   ✅ latest.json found (${stats.size} bytes)`);

    // Validate JSON structure
    try {
      const data = JSON.parse(fs.readFileSync(latestJson, 'utf-8'));
      if (data.artists && Array.isArray(data.artists)) {
        console.log(`   ✅ Valid JSON structure with ${data.artists.length} artists`);
      } else {
        console.log(`   ⚠️  JSON structure may be incomplete`);
      }
    } catch (e) {
      console.log(`   ❌ Invalid JSON format: ${e.message}`);
      isValid = false;
    }
  } else {
    console.log(`   ❌ latest.json NOT found`);
    isValid = false;
  }

  // Check historical directory
  if (fs.existsSync(historicalDir)) {
    const files = fs.readdirSync(historicalDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    console.log(`   ✅ historical/ directory found with ${jsonFiles.length} JSON files`);

    if (jsonFiles.length > 0) {
      // Show first and last files
      const sorted = jsonFiles.sort();
      console.log(`   📅 Date range: ${sorted[0]} to ${sorted[sorted.length - 1]}`);
    }
  } else {
    console.log(`   ⚠️  historical/ directory NOT found`);
  }

  return isValid;
}

// Main execution
try {
  let sourceFound = null;
  let sourceData = null;

  // Try each possible source location
  for (let i = 0; i < possibleSources.length; i++) {
    const src = possibleSources[i];
    console.log(`📍 Trying location ${i + 1}: ${src}`);

    if (fs.existsSync(src)) {
      const latestFile = path.join(src, 'latest.json');
      const historicalDir = path.join(src, 'historical');

      // Verify this is actually a data directory
      if (fs.existsSync(latestFile)) {
        console.log(`   ✅ FOUND! This location contains data files`);
        sourceFound = src;
        sourceData = src;
        break;
      } else {
        console.log(`   ⚠️  Directory exists but missing latest.json`);
      }
    } else {
      console.log(`   ❌ Path does not exist`);
    }
  }

  console.log('');

  if (!sourceFound) {
    console.log('========================================');
    console.log('⚠️  NO SOURCE DATA FOUND');
    console.log('========================================');
    console.log('This is OK if:');
    console.log('  - Data files are already in the correct location');
    console.log('  - This is a fresh deployment without data');
    console.log('  - Data will be provided via environment variables');
    console.log('');
    console.log('The bot will attempt to load data at runtime.');
    console.log('========================================');
    process.exit(0); // Exit successfully, not an error
  }

  console.log('========================================');
  console.log('📋 COPY OPERATION STARTING');
  console.log('========================================');
  console.log(`Source:      ${sourceData}`);
  console.log(`Destination: ${destData}`);
  console.log('');

  // Check if destination already has data
  if (fs.existsSync(destData)) {
    const destLatest = path.join(destData, 'latest.json');
    if (fs.existsSync(destLatest)) {
      console.log('⚠️  Destination already contains data files');
      console.log('   This will be overwritten...');
      console.log('');
    }
  }

  // Perform the copy
  copyDir(sourceData, destData);

  console.log('');
  console.log('========================================');
  console.log('✅ COPY COMPLETED SUCCESSFULLY');
  console.log('========================================');

  // Verify the copied data
  const isValid = verifyData(destData);

  console.log('');
  if (isValid) {
    console.log('========================================');
    console.log('✅ ALL CHECKS PASSED - DATA READY');
    console.log('========================================');
    process.exit(0);
  } else {
    console.log('========================================');
    console.log('⚠️  WARNINGS DETECTED - CHECK LOGS');
    console.log('========================================');
    console.log('Copy completed but some data files may be missing.');
    console.log('The bot may still work with limited functionality.');
    process.exit(0); // Don't fail the build
  }

} catch (error) {
  console.log('');
  console.log('========================================');
  console.log('❌ ERROR DURING COPY OPERATION');
  console.log('========================================');
  console.error('Error details:', error.message);
  console.error('Stack trace:', error.stack);
  console.log('');
  console.log('This error will not stop deployment.');
  console.log('The bot will attempt to load data at runtime.');
  console.log('========================================');
  process.exit(0); // Don't fail the build, let runtime handle it
}
