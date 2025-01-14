#!/bin/bash

# Function to bump version
bump_version() {
    local version=$1
    local type=$2
    
    # Split version into major, minor, patch
    IFS='.' read -r major minor patch <<< "$version"
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid version bump type. Use: major, minor, or patch"
            exit 1
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Validate arguments
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <major|minor|patch>"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(grep '"version":' manifest.json | cut -d'"' -f4)

# Validate current version format
if ! [[ $CURRENT_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Current version must follow semantic versioning (MAJOR.MINOR.PATCH)"
    exit 1
fi

# Calculate new version
NEW_VERSION=$(bump_version "$CURRENT_VERSION" "$1")

echo "Bumping $1 version: $CURRENT_VERSION -> $NEW_VERSION"

# Update version in manifest.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" manifest.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" extension/manifest.json

# Update version in userscript
sed -i '' "s/@version.*/@version      $NEW_VERSION/" bamboo-plus.user.js
sed -i '' "s/@version.*/@version      $NEW_VERSION/" extension/bamboo-plus.user.js

echo "Version updated to $NEW_VERSION"
echo ""
echo "Next steps:"
echo "1. Commit the version change:"
echo "   git add . && git commit -m \"Bump version to $NEW_VERSION\""
echo "2. Create and push a version tag:"
echo "   git tag v$NEW_VERSION && git push origin v$NEW_VERSION"
echo "3. Push the changes:"
echo "   git push" 