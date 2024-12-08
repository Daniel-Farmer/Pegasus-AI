let currentModel = 'llama2';

export function setCurrentModel(model) {
    currentModel = model;
    console.log(`AI model set to: ${currentModel}`);
}

export async function sendMessage(message) {
    console.log('Sending message:', message);
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt: message,
                model: currentModel
            }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        return data.response;
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
}

export async function testApiConnection() {
    console.log('Testing API connection...');
    try {
        const response = await fetch('/api/test', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            console.log('API connection successful:', data.message);
        } else {
            console.error('API connection failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error testing API connection:', error);
    }
}