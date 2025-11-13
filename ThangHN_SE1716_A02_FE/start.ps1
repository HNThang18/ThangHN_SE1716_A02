# Quick Start Script
# Run this to start the frontend

Write-Host "================================" -ForegroundColor Cyan
Write-Host "FU News Management - Frontend" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not installed!" -ForegroundColor Yellow
    Write-Host "Running npm install..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    Write-Host "Please create .env.local file with:" -ForegroundColor Red
    Write-Host "NEXT_PUBLIC_API_URL=http://localhost:5000/api" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "📝 Make sure your backend is running!" -ForegroundColor Yellow
Write-Host "🌐 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔑 Login: admin@FUNewsManagementSystem.org / @@abc123@@" -ForegroundColor Cyan
Write-Host ""

npm run dev
