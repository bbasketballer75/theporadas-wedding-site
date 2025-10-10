// Verify Next config does not export a webpack property when Turbopack is active
const path = require('path');
const configPath = path.join(__dirname, '..', 'next.config.js');
// Allow explicit simulation of Turbopack via CLI flag so local verification can run on Windows reliably
if (process.argv.includes('--turbopack')) {
  process.env.NEXT_TURBOPACK = '1';
}

const cfg = require(configPath);

console.log('Loaded next config keys:', Object.keys(cfg));
if (cfg && Object.prototype.hasOwnProperty.call(cfg, 'webpack')) {
  console.error(
    'Detected webpack property in exported Next config. This will trigger the Turbopack warning.'
  );
  process.exit(1);
}

console.log('No webpack property detected in exported config. OK.');
process.exit(0);
