#!/bin/bash
set -e

REPO="$(cd "$(dirname "$0")" && pwd)"

echo "==> Building frontend..."
cd "$REPO/frontend"
npm install
npm run build

echo "==> Publishing backend..."
cd "$REPO/backend/EnergyDashboard.Api"
dotnet publish -c Release -o publish

echo "==> Starting pm2..."
cd "$REPO"
pm2 startOrRestart ecosystem.config.js

echo "==> Saving pm2 process list..."
pm2 save

echo "Done. Frontend on :3000, backend on :5000"
