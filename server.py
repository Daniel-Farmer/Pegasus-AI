from flask import Flask, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

# Pegasus ASCII art logo
PEGASUS_LOGO = """                                                                          
                 @@                                            
                 @@@@                                          
                  @@@@@                                        
                   @@@@@@         @@@@@@@@                     
                 @@  @@@@@    @@@@@@@@@@@@                     
                 @@@@  @@@@  @@@@@@    @@@                     
                  @@@%@  @  @@@@  @@@  @@@                     
                   @@@@@@  @@@@ @@@@@  @@@                     
                 @@  @@@@@@@@@  @@@@   @@@                     
                 @@@@  @@@@@@@  @@@@   @@@                     
                  @@@@@  @@@@@@  @@@@@ @@@                     
                    @@@@@  @@@@@  @@@@@@                       
                      @@@@@  @@@@@  @@@@@                      
                       @@@@@@  @@@@@  @@@@                     
                         @@@@@   @@@@@  @@@                    
                           @@@@@  @@@@@ @@@                    
                             @@@@@  @@@  @                     
                               @@@@  @@                        
                                @@@@ @@                        
                                 @@@                           
                                  @                            
                                 @                                      
                                          
"""

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Route for the Ollama API
@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        # Print the Pegasus logo to the console when a request is made
        print(PEGASUS_LOGO)
        print("Processing request...")

        data = request.json
        response = requests.post('http://localhost:11434/api/generate', json=data)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)