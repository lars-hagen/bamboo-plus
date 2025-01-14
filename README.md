# Bamboo Plus

Enhanced BambooHR experience with improved UI and smart features.

## Installation Options

### Option 1: Chrome Extension
1. Download this folder
2. Go to Chrome Extensions (chrome://extensions/)
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select this folder

### Option 2: Tampermonkey
1. Install Tampermonkey browser extension
2. Click [bamboo-plus.user.js](bamboo-plus.user.js)
3. Click "Install"

### Latest Releases

#### Stable Version
Install the latest stable version from the [Releases](https://github.com/lars-hagen/bamboo-plus/releases/latest) page.

#### Development Version
For the latest development build with new features and fixes:
1. Go to the [Releases](https://github.com/lars-hagen/bamboo-plus/releases) page
2. Look for releases marked as "Pre-release"
3. Download the latest pre-release version
4. Note: Development builds may be unstable

## Features
- Smart timesheet autofill with configurable defaults
- Skip holidays and vacation days automatically
- Improved UI with easy access to controls
- Remembers your preferences

## Development

The core functionality is in `bamboo-plus.user.js`, which works both as a userscript and as the content script for the Chrome extension.

### Building
```bash
# Development build
./build.sh dev

# Production build
./build.sh prod
```

### Release Process
1. Commits to `dev` branch create development builds
2. After testing, changes are merged to `main` via PR
3. Commits to `main` create stable releases 