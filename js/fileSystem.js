export function fetchFiles(path = '.') {
    fetch(`/api/get_files?path=${encodeURIComponent(path)}`)
        .then(response => response.json())
        .then(files => {
            displayFiles(files, path);
        })
        .catch(error => console.error('Error:', error));
}

function displayFiles(files, path) {
    // Implement the logic to display files in the file explorer
    console.log('Displaying files:', files);
    // You'll need to implement this function to update the DOM
}

export function openFile(filePath) {
    // Implementation for opening a file
    console.log('Opening file:', filePath);
    // You'll need to implement this function to handle file opening
}