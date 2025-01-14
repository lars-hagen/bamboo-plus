#!/bin/bash

BUILD_TYPE=${1:-dev}  # Default to dev build if not specified
VERSION=${2:-$(grep '"version":' extension/manifest.json | cut -d'"' -f4)}  # Use provided version or get from manifest

if [ "$BUILD_TYPE" = "dev" ]; then
    # For dev builds: VERSION-dev.YYYYMMDD.HHMMSS.COMMIT_HASH
    TIMESTAMP=$(date +%Y%m%d.%H%M%S)
    COMMIT_HASH=$(git rev-parse --short HEAD)
    VERSION="${VERSION}-dev.${TIMESTAMP}.${COMMIT_HASH}"
fi

echo "Building version ${VERSION}..."

# Validate userscript metadata
if ! grep -q "@name.*Bamboo Plus" extension/bamboo-plus.user.js || \
   ! grep -q "@version" extension/bamboo-plus.user.js || \
   ! grep -q "@description" extension/bamboo-plus.user.js; then
    echo "❌ Build failed: Missing required userscript metadata"
    exit 1
fi

# Create build directory
rm -rf build
mkdir -p build

# Copy extension files
cp -r extension/* build/

# Update version in files - handle both macOS and Linux sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires backup extension
    sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" build/manifest.json
    sed -i '' "s/@version.*/@version      ${VERSION}/" build/bamboo-plus.user.js
else
    # Linux doesn't need backup extension
    sed -i "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" build/manifest.json
    sed -i "s/@version.*/@version      ${VERSION}/" build/bamboo-plus.user.js
fi

# Copy userscript to root for semantic-release
cp build/bamboo-plus.user.js ./bamboo-plus.user.js

# Create zip
cd build
zip -r "../bamboo-plus-v${VERSION}.zip" *
cd ..

echo "Build complete: bamboo-plus-v${VERSION}.zip"

# For dev builds, offer to load in Chrome
if [ "$BUILD_TYPE" = "dev" ]; then
    echo ""
    echo "To load in Chrome:"
    echo "1. Go to chrome://extensions/"
    echo "2. Enable Developer mode"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'build' directory"
fi 