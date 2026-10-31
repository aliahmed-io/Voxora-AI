# Voxora AI - 1-Click Launch Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting Voxora AI with Automated Port Detection...    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonExe = Join-Path $scriptDir "backend\venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    $pythonExe = "python"
}

& $pythonExe (Join-Path $scriptDir "run.py")
