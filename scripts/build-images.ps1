# Regenerate derived JPG assets without changing the owner-supplied originals.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = if ($PSScriptRoot) { Split-Path $PSScriptRoot -Parent } else { (Get-Location).Path }
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$quality = New-Object System.Drawing.Imaging.EncoderParameters(1)
$quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]75)

function Save-ResizedImage($sourceName, $outputName, [int]$width) {
    $source = [System.Drawing.Image]::FromFile((Join-Path $root $sourceName))
    $bitmap = $null
    $graphics = $null
    try {
        $height = [int][Math]::Round($source.Height * $width / $source.Width)
        $bitmap = New-Object System.Drawing.Bitmap($width, $height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($source, 0, 0, $width, $height)
        $bitmap.Save((Join-Path $root $outputName), $encoder, $quality)
        Write-Output "$outputName : ${width}x${height}"
    } finally {
        if ($graphics) { $graphics.Dispose() }
        if ($bitmap) { $bitmap.Dispose() }
        $source.Dispose()
    }
}

try {
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.17.40.jpeg' 'dr-nihar-portrait-900.jpg' 900
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.17.40.jpeg' 'dr-nihar-portrait-600.jpg' 600
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.14.57 (2).jpeg' 'dr-nihar-teaching.jpg' 725
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.14.57.jpeg' 'dr-nihar-scrubs.jpg' 600
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.14.56.jpeg' 'dr-nihar-speaking.jpg' 600
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.14.58 (1).jpeg' 'dr-nihar-workshop.jpg' 1000
    Save-ResizedImage 'WhatsApp Image 2026-06-20 at 16.14.57 (1).jpeg' 'dr-nihar-group-session.jpg' 1000

    $bitmap = New-Object System.Drawing.Bitmap(1200, 630)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $portrait = [System.Drawing.Image]::FromFile((Join-Path $root 'dr-nihar-portrait-900.jpg'))
    $ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#153c40'))
    $teal = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#176057'))
    $serif = New-Object System.Drawing.Font('Georgia', 45, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $sans = New-Object System.Drawing.Font('Arial', 25, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $small = New-Object System.Drawing.Font('Arial', 19, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    try {
        $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#faf9f5'))
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
        $graphics.DrawImage($portrait, 720, 15, 480, 600)
        $graphics.DrawString('LOGICALSURGEONN', $small, $teal, 65, 110)
        $graphics.DrawString('Dr. Nihar Thakkar', $serif, $ink, 60, 185)
        $graphics.DrawString('General Surgeon & Surgery Educator', $sans, $ink, 65, 270)
        $graphics.DrawString('Clinic enquiries | Courses | Publications', $sans, $teal, 65, 360)
        $graphics.DrawString('Mumbai, India', $small, $ink, 65, 460)
        $bitmap.Save((Join-Path $root 'social-preview.jpg'), $encoder, $quality)
        Write-Output 'social-preview.jpg : 1200x630'
    } finally {
        $small.Dispose(); $sans.Dispose(); $serif.Dispose()
        $ink.Dispose(); $teal.Dispose(); $portrait.Dispose()
        $graphics.Dispose(); $bitmap.Dispose()
    }
} finally {
    $quality.Dispose()
}