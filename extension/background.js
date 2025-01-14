const GITHUB_REPO = 'lars-hagen/bamboo-plus';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Check once per day

async function checkForUpdates() {
    const currentVersion = chrome.runtime.getManifest().version;
    
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        const data = await response.json();
        
        if (data.tag_name) {
            const latestVersion = data.tag_name.replace('v', '');
            if (latestVersion > currentVersion) {
                // Show notification
                chrome.action.setBadgeText({ text: '!' });
                chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9' });
            } else {
                chrome.action.setBadgeText({ text: '' });
            }
        }
    } catch (error) {
        console.error('Background update check failed:', error);
    }
}

// Check for updates periodically
chrome.alarms.create('updateCheck', {
    periodInMinutes: CHECK_INTERVAL / 1000 / 60
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateCheck') {
        checkForUpdates();
    }
});

// Initial check
checkForUpdates(); 