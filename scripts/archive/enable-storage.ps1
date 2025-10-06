# Firebase Storage Setup Script
# Run this AFTER enabling Storage in the Firebase Console

Write-Host "🔥 Firebase Storage Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Step 1: Enable Storage in Console" -ForegroundColor Yellow
Write-Host "Open: https://console.firebase.google.com/project/the-poradas-2025-813c7/storage" -ForegroundColor White
Write-Host "   1. Click 'Get Started'" -ForegroundColor Gray
Write-Host "   2. Select 'Production mode' → Next" -ForegroundColor Gray
Write-Host "   3. Choose 'us-central1' → Done" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you completed Step 1? (y/n)"

if ($continue -eq 'y') {
    Write-Host ""
    Write-Host "✅ Step 2: Deploying Storage Rules..." -ForegroundColor Yellow
    firebase deploy --only storage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Storage Setup Complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📸 What's Next:" -ForegroundColor Cyan
        Write-Host "   1. Deploy Functions: firebase deploy --only functions" -ForegroundColor Gray
        Write-Host "   2. Test uploads at: https://the-poradas-2025-813c7.web.app/gallery" -ForegroundColor Gray
        Write-Host "   3. Monitor usage: https://console.firebase.google.com/project/the-poradas-2025-813c7/storage" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ Storage rules deployment failed" -ForegroundColor Red
        Write-Host "Make sure you enabled Storage in the console first!" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "👉 Please enable Storage in the console first, then run this script again" -ForegroundColor Yellow
}
