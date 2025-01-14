#!/bin/bash

# Get version from manifest.json
VERSION=$(grep '"version":' manifest.json | cut -d'"' -f4)
BUILD_TYPE=${1:-dev}  # Default to dev build if not specified

if [ "$BUILD_TYPE" = "dev" ]; then
    VERSION="${VERSION}-dev.$(date +%Y%m%d.%H%M)"
fi

echo "Building version ${VERSION}..."

# Create build directory
rm -rf build
mkdir -p build

# Copy extension files
cp -r extension/* build/

# Update version in copied files
sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" build/manifest.json
sed -i '' "s/@version.*/@version      ${VERSION}/" build/bamboo-plus.user.js

# Create zip
cd build
zip -r "../bamboo-plus-${VERSION}.zip" *
cd ..

echo "Build complete: bamboo-plus-${VERSION}.zip"

# For dev builds, offer to load in Chrome
if [ "$BUILD_TYPE" = "dev" ]; then
    echo ""
    echo "To load in Chrome:"
    echo "1. Go to chrome://extensions/"
    echo "2. Enable Developer mode"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'build' directory"
fi 