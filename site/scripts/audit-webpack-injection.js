#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const nm = path.join(root, 'node_modules');

const projectPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const topLevelPackages = new Set([
  ...Object.keys(projectPkg.dependencies || {}),
  ...Object.keys(projectPkg.devDependencies || {}),
]);

const toleratedPackages = new Set([
  'next',
  '@ducanh2912/next-pwa',
  '@ffmpeg/ffmpeg',
  '@ffmpeg/util',
  '@supabase/supabase-js',
  'google-auth-library',
  'eslint',
]);

const dependencySections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'bundledDependencies',
  'bundleDependencies',
];

function collectSignals(pkgJson) {
  const signals = [];
  for (const section of dependencySections) {
    const deps = pkgJson[section];
    if (!deps) continue;
    for (const depName of Object.keys(deps)) {
      if (depName.toLowerCase().includes('webpack')) {
        signals.push(`${section}:${depName}`);
      }
    }
  }
  const scripts = pkgJson.scripts || {};
  for (const [scriptName, command] of Object.entries(scripts)) {
    if (typeof command === 'string' && command.toLowerCase().includes('webpack')) {
      signals.push(`script:${scriptName}`);
    }
  }
  if (typeof pkgJson.webpack !== 'undefined') {
    signals.push('webpack-field');
  }
  return signals;
}

function safeRead(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

const results = [];

if (!fs.existsSync(nm)) {
  console.error('No node_modules in site/ — run npm ci first.');
  process.exitCode = 0;
  process.stdout.write(JSON.stringify({ note: 'no_node_modules' }, null, 2));
  process.exit(0);
}

const packages = fs.readdirSync(nm).filter((d) => !d.startsWith('.'));

for (const pkg of packages) {
  // skip scoped packages - inspect inside
  if (pkg.startsWith('@')) {
    const scopedDir = path.join(nm, pkg);
    for (const sub of fs.readdirSync(scopedDir)) {
      const pkgPath = path.join(scopedDir, sub);
      const packageJson = path.join(pkgPath, 'package.json');
      const pkgData = safeRead(packageJson);
      if (!pkgData) continue;
      let parsed;
      try {
        parsed = JSON.parse(pkgData);
      } catch {
        continue;
      }
      if (!topLevelPackages.has(parsed.name)) continue;
      const signals = collectSignals(parsed);
      if (signals.length) {
        results.push({
          package: parsed.name,
          reason: `references webpack via ${signals.join(', ')}`,
        });
      }
    }
    continue;
  }

  const pkgPath = path.join(nm, pkg);
  const packageJson = path.join(pkgPath, 'package.json');
  const pkgData = safeRead(packageJson);
  if (!pkgData) continue;
  let parsed;
  try {
    parsed = JSON.parse(pkgData);
  } catch {
    continue;
  }
  if (!topLevelPackages.has(parsed.name)) continue;
  const signals = collectSignals(parsed);
  if (signals.length) {
    results.push({ package: parsed.name, reason: `references webpack via ${signals.join(', ')}` });
  }
}

const out = path.join(root, '.webpack-injection-report.json');
const report = { results, toleratedPackages: Array.from(toleratedPackages) };
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log('Audit complete. Report written to', out);

const actionable = results.filter((r) => !toleratedPackages.has(r.package));

if (actionable.length) {
  console.log('Potential webpack injectors detected:');
  console.table(
    actionable.map((r) => ({ package: r.package, reason: r.reason, file: r.file || '' }))
  );
  console.log('Action required for packages outside tolerated allowlist.');
  console.table(
    actionable.map((r) => ({ package: r.package, reason: r.reason, file: r.file || '' }))
  );
  process.exitCode = 2;
} else {
  process.exitCode = 0;
}
