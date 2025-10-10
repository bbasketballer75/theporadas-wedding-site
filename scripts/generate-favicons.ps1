# ============================================================================
# Generate Favicons Script
# Converts SVG template to PNG favicons using ImageMagick or online service
# ============================================================================

param(
    [switch]$UseOnline = $false
)

$ErrorActionPreference = "Stop"
$sitePath = "F:\wedding-website\site\public"
$svgTemplate = "$sitePath\favicon-template.svg"

Write-Host "=== Favicon Generation Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$imageMagickInstalled = $false
try {
    $magickVersion = magick --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $imageMagickInstalled = $true
        Write-Host "✓ ImageMagick detected" -ForegroundColor Green
    }
}
catch {
    Write-Host "✗ ImageMagick not found" -ForegroundColor Yellow
}

if ($imageMagickInstalled -and -not $UseOnline) {
    Write-Host ""
    Write-Host "Generating favicons from SVG template..." -ForegroundColor Cyan
    
    # Generate 32x32 favicon
    Write-Host "  → favicon-32x32.png" -ForegroundColor Gray
    magick "$svgTemplate" -resize 32x32 "$sitePath\favicon-32x32.png"
    
    # Generate 16x16 favicon
    Write-Host "  → favicon-16x16.png" -ForegroundColor Gray
    magick "$svgTemplate" -resize 16x16 "$sitePath\favicon-16x16.png"
    
    # Generate 180x180 Apple touch icon
    Write-Host "  → apple-touch-icon.png" -ForegroundColor Gray
    magick "$svgTemplate" -resize 180x180 "$sitePath\apple-touch-icon.png"
    
    Write-Host ""
    Write-Host "✓ Favicons generated successfully!" -ForegroundColor Green
    
}
else {
    Write-Host ""
    Write-Host "MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Install ImageMagick (Recommended):" -ForegroundColor Cyan
    Write-Host "  1. Download from: https://imagemagick.org/script/download.php#windows"
    Write-Host "  2. Install with 'Add to PATH' option checked"
    Write-Host "  3. Restart PowerShell and run this script again"
    Write-Host ""
    Write-Host "Option 2 - Use Online Tool:" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://realfavicongenerator.net/"
    Write-Host "  2. Upload: $svgTemplate"
    Write-Host "  3. Download generated favicons"
    Write-Host "  4. Extract to: $sitePath"
    Write-Host ""
    Write-Host "Option 3 - Use favicon-template.svg directly:" -ForegroundColor Cyan
    Write-Host "  1. Open: $svgTemplate in browser"
    Write-Host "  2. Take screenshot at different sizes (32x32, 16x16, 180x180)"
    Write-Host "  3. Save as PNG files in: $sitePath"
    Write-Host ""
    Write-Host "Required files:" -ForegroundColor White
    Write-Host "  • favicon-32x32.png (32x32px)"
    Write-Host "  • favicon-16x16.png (16x16px)"
    Write-Host "  • apple-touch-icon.png (180x180px)"
}

Write-Host ""
Write-Host "Current template location:" -ForegroundColor Gray
Write-Host "  $svgTemplate" -ForegroundColor White
