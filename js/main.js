import { sendMessage, setCurrentModel, testApiConnection } from './aiService.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const aiModelSelect = document.getElementById('ai-model');

    // Test API connection on page load
    testApiConnection();

    aiModelSelect.addEventListener('change', (e) => {
        setCurrentModel(e.target.value);
    });

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    async function handleSendMessage() {
        console.log('Handling send message');
        const message = userInput.value.trim();
        if (message) {
            try {
                console.log('Sending message:', message);
                // Display user message
                displayMessage('User', message);

                // Clear input
                userInput.value = '';

                // Send message to AI and get response
                const response = await sendMessage(message);
                console.log('Received response:', response);

                // Display AI response
                displayMessage('AI', response);
            } catch (error) {
                console.error('Error sending message:', error);
                displayMessage('System', 'An error occurred while processing your request.');
            }
        }
    }

    function displayMessage(sender, message) {
        console.log(`Displaying message from ${sender}:`, message);
        const messageElement = document.createElement('div');
        messageElement.className = `message-card ${sender.toLowerCase()}-message`;
        messageElement.innerHTML = `
            <div class="message-header">${sender}</div>
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});