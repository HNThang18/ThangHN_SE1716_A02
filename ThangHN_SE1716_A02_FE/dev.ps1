# Development Helper Script
# Useful commands for development

param(
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Development Helper Commands" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  install     - Install all dependencies" -ForegroundColor White
    Write-Host "  dev         - Start development server" -ForegroundColor White
    Write-Host "  build       - Build for production" -ForegroundColor White
    Write-Host "  start       - Start production server" -ForegroundColor White
    Write-Host "  clean       - Clean build files and node_modules" -ForegroundColor White
    Write-Host "  check       - Check backend connection" -ForegroundColor White
    Write-Host "  help        - Show this help message" -ForegroundColor White
    Write-Host ""
}

function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Done!" -ForegroundColor Green
}

function Start-Dev {
    Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
    npm run dev
}

function Build-Project {
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    npm run build
    Write-Host "✅ Build complete!" -ForegroundColor Green
}

function Start-Production {
    Write-Host "🚀 Starting production server..." -ForegroundColor Yellow
    npm run start
}

function Clean-Project {
    Write-Host "🧹 Cleaning project..." -ForegroundColor Yellow
    
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next"
        Write-Host "  ✓ Removed .next" -ForegroundColor Gray
    }
    
    if (Test-Path "node_modules") {
        Write-Host "  Removing node_modules (this may take a while)..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "  ✓ Removed node_modules" -ForegroundColor Gray
    }
    
    Write-Host "✅ Clean complete!" -ForegroundColor Green
    Write-Host "Run '.\dev.ps1 install' to reinstall dependencies" -ForegroundColor Yellow
}

function Check-Backend {
    Write-Host "🔍 Checking backend connection..." -ForegroundColor Yellow
    
    # Read API URL from .env.local
    $apiUrl = "http://localhost:5000/api"
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local"
        foreach ($line in $envContent) {
            if ($line -match "NEXT_PUBLIC_API_URL=(.+)") {
                $apiUrl = $matches[1]
                break
            }
        }
    }
    
    Write-Host "API URL: $apiUrl" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl" -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Backend is running!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Cannot connect to backend!" -ForegroundColor Red
        Write-Host "Make sure the backend is running at: $apiUrl" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start backend:" -ForegroundColor Yellow
        Write-Host "  cd ..\ThangHN_SE1716_A02_BE\ThangHN_SE1716_A02_BE" -ForegroundColor Gray
        Write-Host "  dotnet run" -ForegroundColor Gray
    }
}

# Main script logic
switch ($Command.ToLower()) {
    "install" { Install-Dependencies }
    "dev" { Start-Dev }
    "build" { Build-Project }
    "start" { Start-Production }
    "clean" { Clean-Project }
    "check" { Check-Backend }
    "help" { Show-Help }
    default {
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
