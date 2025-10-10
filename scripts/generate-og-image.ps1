# ============================================================================
# Generate Open Graph Image Script
# Converts SVG template to JPG using ImageMagick or online service
# ============================================================================

$ErrorActionPreference = "Stop"
$sitePath = "F:\wedding-website\site\public"
$svgTemplate = "$sitePath\og-image-template.svg"
$outputJpg = "$sitePath\og-image.jpg"

Write-Host "=== Open Graph Image Generation Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$imageMagickInstalled = $false
try {
    $magickVersion = magick --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $imageMagickInstalled = $true
        Write-Host "✓ ImageMagick detected" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ ImageMagick not found" -ForegroundColor Yellow
}

if ($imageMagickInstalled) {
    Write-Host ""
    Write-Host "Generating og-image.jpg from SVG template..." -ForegroundColor Cyan
    
    # Generate 1200x630 OG image with high quality
    magick "$svgTemplate" -resize 1200x630 -quality 90 "$outputJpg"
    
    if (Test-Path $outputJpg) {
        $fileSize = (Get-Item $outputJpg).Length / 1KB
        Write-Host ""
        Write-Host "✓ Open Graph image generated successfully!" -ForegroundColor Green
        Write-Host "  Location: $outputJpg" -ForegroundColor Gray
        Write-Host "  Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "✗ Failed to generate image" -ForegroundColor Red
    }
    
} else {
    Write-Host ""
    Write-Host "MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Install ImageMagick (Recommended):" -ForegroundColor Cyan
    Write-Host "  1. Download from: https://imagemagick.org/script/download.php#windows"
    Write-Host "  2. Install with 'Add to PATH' option checked"
    Write-Host "  3. Restart PowerShell and run this script again"
    Write-Host ""
    Write-Host "Option 2 - Use Online Converter:" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://cloudconvert.com/svg-to-jpg"
    Write-Host "  2. Upload: $svgTemplate"
    Write-Host "  3. Set dimensions: 1200x630px"
    Write-Host "  4. Download and save as: $outputJpg"
    Write-Host ""
    Write-Host "Option 3 - Use Browser Screenshot:" -ForegroundColor Cyan
    Write-Host "  1. Open: $svgTemplate in Chrome/Edge"
    Write-Host "  2. Press F12, toggle device toolbar (Ctrl+Shift+M)"
    Write-Host "  3. Set viewport: 1200x630"
    Write-Host "  4. Take full-page screenshot"
    Write-Host "  5. Save as: $outputJpg"
    Write-Host ""
    Write-Host "Option 4 - Use Canva (Most Professional):" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://www.canva.com/"
    Write-Host "  2. Create design: 1200 x 630 px"
    Write-Host "  3. Use template with:"
    Write-Host "     • Names: Austin & Jordyn"
    Write-Host "     • Date: May 10, 2025"
    Write-Host "     • Colors: #9ca986 (sage), #d8a7b1 (blush), #f5f1e6 (cream)"
    Write-Host "  4. Download as JPG and save to: $outputJpg"
    Write-Host ""
    Write-Host "Required output:" -ForegroundColor White
    Write-Host "  • og-image.jpg (1200x630px, <300KB recommended)"
}

Write-Host ""
Write-Host "Current template location:" -ForegroundColor Gray
Write-Host "  $svgTemplate" -ForegroundColor White
