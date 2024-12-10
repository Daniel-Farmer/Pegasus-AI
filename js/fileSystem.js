export function openFile(filePath) {
    fetch(`/api/read_file?path=${encodeURIComponent(filePath)}`)
        .then(response => response.json())
        .then(data => {
            if (data.content) {
                // Assuming you have a function to display file content in code-display.js
                displayFileContent(data.content, filePath);
            } else {
                console.error('File content not found');
            }
        })
        .catch(error => console.error('Error opening file:', error));
}

// This function should be implemented in code-display.js
function displayFileContent(content, filePath) {
    // Implementation to display file content
    console.log(`Displaying content of ${filePath}`);
    // Update the code display area with the content
    const codeDisplay = document.getElementById('code-display');
    codeDisplay.textContent = content;
}