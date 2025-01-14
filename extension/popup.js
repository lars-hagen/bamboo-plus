const GITHUB_REPO = 'lars-hagen/bamboo-plus';
const currentVersion = chrome.runtime.getManifest().version;

document.getElementById('currentVersion').textContent = currentVersion;

async function checkForUpdates() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        const data = await response.json();
        
        if (!data.tag_name) {
            document.getElementById('status').textContent = 'No updates available';
            return;
        }

        const latestVersion = data.tag_name.replace('v', '');
        if (latestVersion > currentVersion) {
            document.getElementById('newVersion').textContent = latestVersion;
            document.getElementById('updateNotice').classList.add('show');
            document.getElementById('status').textContent = 'Update available!';
            
            // Setup update button
            const updateButton = document.getElementById('updateButton');
            updateButton.onclick = () => {
                window.open(data.html_url);
                document.getElementById('status').textContent = 'Downloading update...';
                updateButton.disabled = true;
            };
        } else {
            document.getElementById('status').textContent = 'You have the latest version';
        }
    } catch (error) {
        document.getElementById('status').textContent = 'Error checking for updates';
        console.error('Update check failed:', error);
    }
}

// Check for updates when popup opens
checkForUpdates(); 