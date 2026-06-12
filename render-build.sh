#!/usr/bin/env bash
# exit on error
set -o errexit

# Install project dependencies
npm install

# Download Chromium for Puppeteer
echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome
echo "Chrome installed successfully!"
