// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to important DOM elements
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const fileTree = document.getElementById('file-tree');
    const codeDisplay = document.getElementById('code-display');

    // Pegasus-themed loading messages
    const pegasusLoadingMessages = [
        "Pegasus is stretching its wings...",
        "Feeding Pegasus some brain food...",
        "Pegasus is galloping through data...",
        "Polishing Pegasus's hooves...",
        "Pegasus is taking flight...",
        "Brushing Pegasus's mane...",
        "Pegasus is doing mental gymnastics...",
        "Pegasus is having a eureka moment..."
    ];

    // Function to get a random Pegasus loading message
    function getRandomPegasusMessage() {
        return pegasusLoadingMessages[Math.floor(Math.random() * pegasusLoadingMessages.length)];
    }

    // Add event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Add event listener for the Enter key in the input field
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to send a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            appendMessage('User', message);
            userInput.value = ''; // Clear the input field
            // Get AI response using Ollama
            await getOllamaResponse(message);
        }
    }

    // Function to append a message to the chat
    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.className = `message-card ${sender.toLowerCase()}-message`;
        
        const headerElement = document.createElement('div');
        headerElement.className = 'message-header';
        headerElement.textContent = sender;
        messageElement.appendChild(headerElement);

        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        if (sender === 'AI' && text.startsWith('<pre>')) {
            contentElement.innerHTML = text;
        } else if (sender === 'AI' && text.includes('```')) {
            // Handle code blocks
            const codeBlocks = text.split('```');
            for (let i = 0; i < codeBlocks.length; i++) {
                if (i % 2 === 1) {
                    // This is a code block
                    const codeElement = document.createElement('pre');
                    codeElement.className = 'code-block';
                    codeElement.textContent = codeBlocks[i].trim();
                    contentElement.appendChild(codeElement);
                    
                    // Add options
                    const optionsDiv = document.createElement('div');
                    optionsDiv.className = 'code-options';
                    const escapedCode = codeBlocks[i].trim().replace(/'/g, "\\'").replace(/"/g, '\\"');
                    optionsDiv.innerHTML = `
                        <button onclick="createNewFile('${escapedCode}')">Create New File</button>
                        <button onclick="copyToClipboard('${escapedCode}')">Copy</button>
                        <button onclick="redoRequest()">Redo</button>
                    `;
                    contentElement.appendChild(optionsDiv);
                } else {
                    // This is regular text
                    const textElement = document.createElement('p');
                    textElement.textContent = codeBlocks[i];
                    contentElement.appendChild(textElement);
                }
            }
        } else {
            // Regular message
            contentElement.textContent = text;
        }
        
        messageElement.appendChild(contentElement);
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageElement; // Return the message element for potential future manipulation
    }

    // Function to get AI response using Ollama
    async function getOllamaResponse(userMessage) {
        const loadingMessage = getRandomPegasusMessage();
        const loadingElement = appendMessage('AI', loadingMessage);
        
        // Add a visual effect to the loading message
        let dots = 0;
        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingElement.querySelector('.message-content').textContent = loadingMessage + '.'.repeat(dots);
        }, 500);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama2',
                    prompt: userMessage,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Clear the loading message
            chatMessages.removeChild(loadingElement);
            clearInterval(loadingInterval);

            appendMessage('AI', data.response);
        } catch (error) {
            console.error('Error:', error);
            
            // Clear the loading message
            chatMessages.removeChild(loadingElement);
            clearInterval(loadingInterval);

            appendMessage('AI', 'Sorry, there was an error processing your request.');
        }
    }

    // Populate the file tree
    fileTree.innerHTML = `
        <ul>
            <li>Project Files
                <ul>
                    <li>Content
                        <ul>
                            <li data-file="article_ideas.txt">article_ideas.txt</li>
                            <li data-file="blog_post_outline.md">blog_post_outline.md</li>
                        </ul>
                    </li>
                    <li>Research
                        <ul>
                            <li data-file="market_analysis.xlsx">market_analysis.xlsx</li>
                            <li data-file="competitor_review.docx">competitor_review.docx</li>
                        </ul>
                    </li>
                    <li>Resources
                        <ul>
                            <li data-file="style_guide.pdf">style_guide.pdf</li>
                            <li data-file="image_assets.zip">image_assets.zip</li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    `;

    // Add click event listeners to file items
    const fileItems = fileTree.querySelectorAll('li[data-file]');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileName = item.getAttribute('data-file');
            displayFileContent(fileName);
        });
    });

    // Function to display file content
    async function displayFileContent(fileName) {
        codeDisplay.innerHTML = '<p>Loading file content...</p>';
        try {
            // Simulated file content (replace with actual content fetching logic in a real application)
            const fileContents = {
                'article_ideas.txt': 'List of article ideas:\n1. Top 10 AI tools for content creation\n2. How AI is revolutionizing content marketing\n3. The future of AI in journalism',
                'blog_post_outline.md': '# AI in Content Development\n\n## Introduction\n- Brief history of AI\n- Current state of AI in content creation\n\n## Benefits of AI in Content Development\n1. Increased efficiency\n2. Improved accuracy\n3. Enhanced personalization\n\n## Challenges and Limitations\n- Ethical considerations\n- Potential job displacement\n\n## Conclusion',
                'market_analysis.xlsx': 'Excel file: Market analysis data (not displayed in this demo)',
                'competitor_review.docx': 'Word document: Detailed competitor analysis (not displayed in this demo)',
                'style_guide.pdf': 'PDF file: Company style guide (not displayed in this demo)',
                'image_assets.zip': 'ZIP file: Collection of image assets (not displayed in this demo)'
            };

            // Simulate a delay to mimic file fetching
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get the content for the selected file, or display a message if not found
            const content = fileContents[fileName] || 'File content not available';
            codeDisplay.innerHTML = `<h2>${fileName}</h2><pre>${content}</pre>`;
        } catch (error) {
            codeDisplay.innerHTML = '<p>Error loading file content. Please try again.</p>';
        }
    }

    // Make getOllamaResponse available globally
    window.getOllamaResponse = getOllamaResponse;
});

// Function to create a new file
function createNewFile(content) {
    const fileName = prompt("Enter file name:");
    if (fileName) {
        // Here you would typically send a request to your server to create the file
        console.log(`Creating new file: ${fileName} with content: ${content}`);
        alert(`File ${fileName} created successfully!`);
    }
}

// Function to copy content to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Code copied to clipboard!");
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

// Function to redo the last request
function redoRequest() {
    // Here you would typically resend the last request to the AI
    console.log("Redoing last request");
    // For demonstration, let's just send a new message
    getOllamaResponse("Please regenerate the last response.");
}