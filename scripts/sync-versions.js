#!/usr/bin/env node

/**
 * Version Sync Script
 * Ensures frontend and backend versions stay in sync to prevent deployment mismatches
 */

const fs = require('fs');
const path = require('path');

const rootPkgPath = path.join(__dirname, '../package.json');
const backendPkgPath = path.join(__dirname, '../backend/package.json');
const frontendPkgPath = path.join(__dirname, '../frontend/package.json');

try {
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf8'));

  const rootVersion = rootPkg.version;

  // Sync versions
  if (backendPkg.version !== rootVersion) {
    console.log(`📦 Syncing backend version: ${backendPkg.version} → ${rootVersion}`);
    backendPkg.version = rootVersion;
    fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2) + '\n');
  }

  if (frontendPkg.version !== rootVersion) {
    console.log(`📦 Syncing frontend version: ${frontendPkg.version} → ${rootVersion}`);
    frontendPkg.version = rootVersion;
    fs.writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, 2) + '\n');
  }

  console.log(`✅ Version sync complete: v${rootVersion}`);
} catch (error) {
  console.error('❌ Version sync failed:', error.message);
  process.exit(1);
}
