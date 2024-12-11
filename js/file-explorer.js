import { openFile } from './fileSystem.js';

export function initFileExplorer() {
    const fileExplorer = document.getElementById('file-explorer');
    const fileTree = document.createElement('ul');
    fileTree.id = 'file-tree';
    fileExplorer.appendChild(fileTree);

    fetchFiles();
}

function fetchFiles(path = '.') {
    fetch(`/api/get_files?path=${encodeURIComponent(path)}`)
        .then(response => response.json())
        .then(files => {
            displayFiles(files, path);
        })
        .catch(error => console.error('Error:', error));
}

function displayFiles(files, currentPath) {
    const fileTree = document.getElementById('file-tree');
    fileTree.innerHTML = '';

    if (currentPath !== '.') {
        const backItem = createFileItem('..', () => {
            const parentPath = currentPath.split('/').slice(0, -1).join('/') || '.';
            fetchFiles(parentPath);
        });
        fileTree.appendChild(backItem);
    }

    files.forEach(file => {
        const filePath = currentPath === '.' ? file : `${currentPath}/${file}`;
        const fileItem = createFileItem(file, () => {
            if (file.includes('.')) {
                openFile(filePath);
            } else {
                fetchFiles(filePath);
            }
        });
        fileTree.appendChild(fileItem);
    });
}

function createFileItem(name, onClick) {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', onClick);
    return li;
}