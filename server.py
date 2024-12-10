from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import subprocess
import requests
import logging
import json

app = Flask(__name__, static_folder='.')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

OLLAMA_API_BASE_URL = "http://localhost:11434"  # Adjust if your Ollama API is running on a different port

@app.route('/api/run_command', methods=['POST'])
def run_command():
    data = request.json
    command = data.get('command')
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return jsonify({'output': result.stdout, 'error': result.stderr})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/get_files', methods=['GET'])
def get_files():
    path = request.args.get('path', '.')
    try:
        files = os.listdir(path)
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/read_file', methods=['GET'])
def read_file():
    file_path = request.args.get('path')
    if not file_path:
        return jsonify({'error': 'No file path provided'}), 400
    
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return jsonify({'content': content})
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/write_file', methods=['POST'])
def write_file():
    data = request.json
    file_path = data.get('path')
    content = data.get('content')
    
    if not file_path or content is None:
        return jsonify({'error': 'File path and content are required'}), 400
    
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        return jsonify({'message': 'File written successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')
    model = data.get('model', 'llama2',)  # Default to llama2, but you can change this

    logging.debug(f"Sending request to Ollama with model: {model} and prompt: {prompt}")

    try:
        response = requests.post(
            f"{OLLAMA_API_BASE_URL}/api/generate",
            json={
                "model": model,
                "prompt": prompt
            },
            stream=True  # Enable streaming
        )
        response.raise_for_status()
        
        full_response = ""
        for line in response.iter_lines():
            if line:
                json_response = json.loads(line)
                full_response += json_response.get('response', '')
                if json_response.get('done', False):
                    break

        logging.debug(f"Received full response from Ollama: {full_response}")
        return jsonify({'response': full_response})
    except requests.RequestException as e:
        logging.error(f"Error communicating with Ollama: {str(e)}")
        return jsonify({'error': f"Error communicating with Ollama: {str(e)}"}), 500

@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({'message': 'API is working'}), 200

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename, mimetype='application/javascript')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    app.run(debug=True)
