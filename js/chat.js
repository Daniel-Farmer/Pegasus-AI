import { sendMessage, setCurrentModel } from './aiService.js';

export function initChat() {
    console.log('Initializing chat...');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const aiModelSelect = document.getElementById('ai-model');

    if (!chatMessages || !userInput || !sendButton || !aiModelSelect) {
        console.error('One or more chat elements not found');
        return;
    }

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    aiModelSelect.addEventListener('change', (e) => {
        setCurrentModel(e.target.value);
    });

    async function handleSendMessage() {
        console.log('handleSendMessage called');
        const message = userInput.value.trim();
        if (message) {
            console.log('Sending message:', message);
            addMessageToChat('User', message);
            userInput.value = '';
            try {
                const response = await sendMessage(message);
                console.log('Received response:', response);
                addMessageToChat('AI', response);
            } catch (error) {
                console.error('Error in handleSendMessage:', error);
                addMessageToChat('System', 'Error: Failed to get AI response');
            }
        }
    }

    function addMessageToChat(sender, message) {
        console.log('Adding message to chat:', sender, message);
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender.toLowerCase()}-message`;
        messageElement.textContent = `${sender}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    console.log('Chat initialized');
}