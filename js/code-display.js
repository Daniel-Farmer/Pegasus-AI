export function initCodeDisplay() {
    console.log('Initializing code display...');
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
        console.log('Highlight.js initialized successfully');
    } else {
        console.error('Highlight.js is not loaded');
    }
}

export function updateCodeDisplay(code) {
    const codeDisplay = document.getElementById('code-display');
    if (codeDisplay) {
        codeDisplay.textContent = code;
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(codeDisplay);
        }
    } else {
        console.error('Code display element not found');
    }
}