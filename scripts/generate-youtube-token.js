const readline = require('readline');

const { google } = require('googleapis');

const CLIENT_ID = 'your-client-id.apps.googleusercontent.com';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n🔐 Authorize this app by visiting this URL:\n');
console.log(authUrl);
console.log('\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the authorization code from the URL: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Tokens received!\n');
    console.log('📝 Save these securely:\n');
    console.log(JSON.stringify(tokens, null, 2));
    console.log('\n⚠️  IMPORTANT: Store refresh_token in Firebase secrets!');
  } catch (error) {
    console.error('❌ Error getting tokens:', error);
  }
  rl.close();
});
