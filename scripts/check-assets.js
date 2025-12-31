#!/usr/bin/env node
/**
 * Pre-build script to verify required assets exist
 * Run before build: node scripts/check-assets.js
 */

const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'public/icons/logo.svg',
  'public/assets/css/themes/lite-purple.min.css',
  'public/assets/fonts/iconsmind/iconsmind.css',
  'public/assets/fonts/iconsmind/iconsmind.woff',
  'public/assets/js/plugins/jquery-3.3.1.min.js',
];

const projectRoot = path.join(__dirname, '..');
let missing = [];

console.log('Checking required assets...\n');

requiredAssets.forEach(asset => {
  const fullPath = path.join(projectRoot, asset);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${asset}`);
  } else {
    console.log(`✗ ${asset} - MISSING`);
    missing.push(asset);
  }
});

if (missing.length > 0) {
  console.log(`\n❌ Missing ${missing.length} required assets!`);
  console.log('Run: git checkout public/ or restore from deployment/production-assets/');
  process.exit(1);
} else {
  console.log('\n✓ All required assets present');
}
