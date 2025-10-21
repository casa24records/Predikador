// Copy data files to bot directory for Railway deployment
const fs = require('fs');
const path = require('path');

const sourceData = path.join(__dirname, '../../data');
const destData = path.join(__dirname, 'data');

console.log('📦 Copying data files for Railway deployment...');
console.log(`Source: ${sourceData}`);
console.log(`Destination: ${destData}`);

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (fs.existsSync(sourceData)) {
    copyDir(sourceData, destData);
    console.log('✅ Data files copied successfully!');

    // Verify
    const latestJson = path.join(destData, 'latest.json');
    const historicalDir = path.join(destData, 'historical');

    if (fs.existsSync(latestJson)) {
      console.log('✅ latest.json found');
    }
    if (fs.existsSync(historicalDir)) {
      const historicalFiles = fs.readdirSync(historicalDir).length;
      console.log(`✅ ${historicalFiles} historical files found`);
    }
  } else {
    console.log('⚠️  Source data directory not found - assuming already in correct location');
  }
} catch (error) {
  console.error('❌ Error copying data files:', error);
  process.exit(1);
}
