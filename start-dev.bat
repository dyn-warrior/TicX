@echo off
set PATH=%PATH%;C:\Program Files\nodejs
cd /d "C:\Users\Ratul Tarafder\Desktop\tic-tac-toe"
echo Node.js version:
node --version
echo NPM version:
npm --version
echo.
echo Starting TicX development server...
npm run dev
