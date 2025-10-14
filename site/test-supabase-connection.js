// Quick test to verify Supabase configuration
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Supabase Configuration...\n');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

// Debug: Show all parsed vars
console.log('Parsed variables:', Object.keys(envVars).filter(k => k.includes('SUPABASE')));
console.log('');

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Variables:');
console.log('---------------------');
console.log(`URL: ${url ? '✅ Set' : '❌ Missing'}`);
if (url) console.log(`     ${url}`);
console.log(`Key: ${key ? '✅ Set' : '❌ Missing'}`);
if (key) console.log(`     ${key.substring(0, 30)}...`);
console.log('');

if (!url || !key) {
    console.log('❌ Supabase configuration incomplete!\n');
    process.exit(1);
}

if (url !== 'https://shegniwzcjkqfsrgvajs.supabase.co') {
    console.log('⚠️  Warning: URL does not match expected project URL\n');
}

if (key === 'your_anon_key_here') {
    console.log('❌ Placeholder key detected! Replace with actual key from dashboard.\n');
    process.exit(1);
}

console.log('✅ All environment variables are configured!\n');
console.log('📊 Supabase Status:');
console.log('   Project: theporadas-wedding');
console.log('   URL: ' + url);
console.log('   Key Format: ' + (key.startsWith('sb_') || key.startsWith('eyJ') ? '✅ Valid' : '⚠️  Unexpected format'));
console.log('');
console.log('✅ Configuration looks good!');
console.log('📸 Photo upload features should be enabled on the website.');
console.log('');
console.log('Next steps:');
console.log('1. Go to: http://localhost:3001/upload');
console.log('2. Verify warning banners are gone');
console.log('3. Test photo upload functionality');
