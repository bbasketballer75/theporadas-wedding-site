# Add all Firebase environment variables to Vercel
$ErrorActionPreference = "Stop"

$vars = @(
    @{ Name = "NEXT_PUBLIC_FIREBASE_API_KEY"; Value = "AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"; Value = "the-poradas-2025-813c7.firebaseapp.com" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_PROJECT_ID"; Value = "the-poradas-2025-813c7" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"; Value = "the-poradas-2025-813c7.firebasestorage.app" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"; Value = "1059875220445" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_APP_ID"; Value = "1:1059875220445:web:459a645ef2a245728be434" },
    @{ Name = "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"; Value = "G-MT9RJG0YS0" }
)

$environments = @("production", "preview", "development")

Write-Host "🔧 Adding Firebase environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

foreach ($var in $vars) {
    Write-Host "Adding: $($var.Name)" -ForegroundColor White
    
    foreach ($env in $environments) {
        try {
            $output = $var.Value | vercel env add $var.Name $env 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ $env" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠️  $env - $output" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "  ❌ $env - $_" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "✅ All Firebase environment variables added!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Ready to deploy:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
