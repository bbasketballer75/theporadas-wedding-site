# Firebase Project Setup Script
# Complete setup for theporadas-wedding Firebase project

Write-Host "🔥 Firebase Project Setup for The Poradas Wedding" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project: theporadas-wedding" -ForegroundColor Green
Write-Host "Site URL: https://theporadas.web.app" -ForegroundColor Green
Write-Host ""

# Step 1: Enable Firebase APIs
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 1: Enable Firebase APIs in Console" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Please open these URLs and click 'ENABLE' for each API:" -ForegroundColor White
Write-Host ""
Write-Host "1. Firestore API:" -ForegroundColor Cyan
Write-Host "   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=theporadas-wedding" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Cloud Storage API:" -ForegroundColor Cyan
Write-Host "   https://console.developers.google.com/apis/api/storage.googleapis.com/overview?project=theporadas-wedding" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Cloud Functions API:" -ForegroundColor Cyan
Write-Host "   https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=theporadas-wedding" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Cloud Build API (for Functions):" -ForegroundColor Cyan
Write-Host "   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=theporadas-wedding" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you enabled all 4 APIs? (y/n)"

if ($continue -ne 'y') {
    Write-Host ""
    Write-Host "❌ Please enable the APIs first, then run this script again" -ForegroundColor Red
    exit 1
}

# Step 2: Create Firestore Database
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 2: Creating Firestore Database" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "Creating Firestore database in nam5 (US Central)..." -ForegroundColor White
$firestoreResult = firebase firestore:databases:create "(default)" --location=nam5 --project theporadas-wedding 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firestore database created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Firestore database may already exist or API not enabled yet" -ForegroundColor Yellow
    Write-Host "Output: $firestoreResult" -ForegroundColor Gray
}

# Step 3: Enable Storage
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 3: Enable Firebase Storage" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Please open this URL and click 'Get Started':" -ForegroundColor White
Write-Host "https://console.firebase.google.com/project/theporadas-wedding/storage" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'Get Started'" -ForegroundColor Gray
Write-Host "2. Select 'Production mode' → Next" -ForegroundColor Gray
Write-Host "3. Choose 'us-central1' → Done" -ForegroundColor Gray
Write-Host ""

$storageEnabled = Read-Host "Have you enabled Storage? (y/n)"

if ($storageEnabled -ne 'y') {
    Write-Host ""
    Write-Host "❌ Please enable Storage in the console, then run this script again" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy Firestore Rules
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 4: Deploying Firestore Rules" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

firebase deploy --only firestore --project theporadas-wedding

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firestore rules deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Firestore rules deployment failed" -ForegroundColor Red
}

# Step 5: Deploy Storage Rules
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 5: Deploying Storage Rules" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

firebase deploy --only storage --project theporadas-wedding

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Storage rules deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Storage rules deployment failed" -ForegroundColor Red
}

# Step 6: Build and Deploy Hosting
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 STEP 6: Building and Deploying Website" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "Building Next.js site..." -ForegroundColor White
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deploying to Firebase Hosting..." -ForegroundColor White
    firebase deploy --only hosting --project theporadas-wedding
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        Write-Host "✅ Your wedding website is LIVE at:" -ForegroundColor Green
        Write-Host "   https://theporadas.web.app" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📱 Project Console:" -ForegroundColor Yellow
        Write-Host "   https://console.firebase.google.com/project/theporadas-wedding/overview" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
        Write-Host "   1. Deploy Functions: firebase deploy --only functions" -ForegroundColor Gray
        Write-Host "   2. Set up custom domain (optional)" -ForegroundColor Gray
        Write-Host "   3. Test photo uploads at: https://theporadas.web.app/gallery" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Hosting deployment failed" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
