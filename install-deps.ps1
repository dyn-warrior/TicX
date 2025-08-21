# Dependencies installation script for Windows PowerShell

Write-Host "Installing Node.js dependencies for TicX..." -ForegroundColor Green

# Check if npm is available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "npm found, installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
        
        Write-Host "Generating Prisma client..." -ForegroundColor Yellow
        npm run db:generate
        
        Write-Host "Setup complete! You can now run:" -ForegroundColor Green
        Write-Host "  npm run dev (for local development)" -ForegroundColor Cyan
        Write-Host "  OR" -ForegroundColor White
        Write-Host "  make up (for Docker development)" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to install dependencies. Please check your Node.js installation." -ForegroundColor Red
    }
} else {
    Write-Host "npm not found. Please install Node.js first:" -ForegroundColor Red
    Write-Host "  1. Download Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  2. Install Node.js" -ForegroundColor Yellow
    Write-Host "  3. Restart your terminal" -ForegroundColor Yellow
    Write-Host "  4. Run this script again" -ForegroundColor Yellow
}
