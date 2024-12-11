export function setupToggleButtons() {
    console.log('Setting up toggle buttons');
    const toggleFileExplorer = document.getElementById('toggle-file-explorer');
    const toggleChat = document.getElementById('toggle-chat');
    const fileExplorer = document.getElementById('file-explorer');
    const chatContainer = document.getElementById('chat-container');

    if (toggleFileExplorer) {
        toggleFileExplorer.addEventListener('click', () => {
            fileExplorer.classList.toggle('hidden');
        });
    } else {
        console.warn('Toggle file explorer button not found');
    }

    if (toggleChat) {
        toggleChat.addEventListener('click', () => {
            chatContainer.classList.toggle('hidden');
        });
    } else {
        console.warn('Toggle chat button not found');
    }
}

export function updateApiStatus(isOnline) {
    const apiStatusElement = document.getElementById('api-status');
    if (apiStatusElement) {
        apiStatusElement.textContent = isOnline ? 'API: Online' : 'API: Offline';
        apiStatusElement.style.color = isOnline ? 'green' : 'red';
    }
}

export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}