# Bamboo Plus

Enhanced BambooHR experience with improved UI and smart features.

## Features
- Smart timesheet autofill with configurable defaults
- Skip holidays and vacation days automatically
- Improved UI with easy access to controls
- Remembers your preferences
- Auto-update notifications

## Installation

### Chrome Extension
1. Download the latest release from the [releases page](https://github.com/lars-hagen/bamboo-plus/releases)
2. Unzip the downloaded file
3. Go to Chrome Extensions (chrome://extensions/)
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the unzipped folder

### Tampermonkey
1. Install Tampermonkey browser extension
2. Go to the [latest release](https://github.com/lars-hagen/bamboo-plus/releases/latest)
3. Click on `bamboo-plus.user.js`
4. Click "Install"

## Development

### Branch Structure
- `main`: Production-ready code, used for releases
- `dev`: Development branch, all feature branches merge here first

### Building
#### Development Build
```bash
./build.sh
```
This will:
1. Create a dev version with timestamp
2. Copy files to `build` directory
3. Create a zip file
4. Show instructions for loading in Chrome

#### Production Build
```bash
./build.sh prod
```
This will create a production build with the version from manifest.json.

### Development Workflow
1. Create a feature branch from `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your feature branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request to merge into `dev`
5. After review and testing, merge into `dev`
6. When ready for release, merge `dev` into `main`

### Releases
- Pushing to `main` automatically:
  1. Creates a new release with the version from manifest.json
  2. Builds and attaches the extension ZIP
  3. Attaches the userscript file

### Local Development
1. Clone the repository:
   ```bash
   git clone git@github.com:lars-hagen/bamboo-plus.git
   cd bamboo-plus
   ```

2. Switch to dev branch:
   ```bash
   git checkout dev
   ```

3. Create a dev build:
   ```bash
   ./build.sh
   ```

4. Load the extension from the `build` directory in Chrome
5. Make changes and rebuild as needed
6. Create pull request when ready

## Contributing
1. Fork the repository
2. Create your feature branch from `dev`
3. Make your changes
4. Create a Pull Request to merge into `dev`

## License
MIT License - see LICENSE file 