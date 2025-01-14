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
6. When ready for release, merge `dev` into `main` and create a new release

### Creating a Release
1. Ensure all changes are tested in `dev`
2. Update version number in:
   - manifest.json
   - bamboo-plus.user.js
3. Merge `dev` into `main`:
   ```bash
   git checkout main
   git pull
   git merge dev
   git push
   ```
4. Create a new release on GitHub:
   - Tag version with 'v' prefix (e.g., v0.5)
   - Include changelog
   - Attach extension files

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

3. Load the extension in Chrome:
   - Go to chrome://extensions/
   - Enable Developer mode
   - Load unpacked extension from the `extension` folder

4. Make changes and test
5. Create pull request when ready

## Contributing
1. Fork the repository
2. Create your feature branch from `dev`
3. Make your changes
4. Create a Pull Request to merge into `dev`

## License
MIT License - see LICENSE file 