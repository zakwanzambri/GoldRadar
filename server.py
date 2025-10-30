#!/usr/bin/env python3
"""
Custom HTTP server for Single Page Application (SPA) routing.
Serves index.html for all routes that don't correspond to actual files.
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove query parameters for file checking
        clean_path = path.split('?')[0]
        
        # If it's the root path, serve index.html
        if clean_path == '/':
            self.serve_index()
            return
            
        # Check if the requested path corresponds to an actual file
        file_path = clean_path.lstrip('/')
        if os.path.isfile(file_path):
            # File exists, serve it normally
            super().do_GET()
            return
            
        # Check if it's a directory
        if os.path.isdir(file_path):
            super().do_GET()
            return
            
        # For SPA routes (like /home, /dashboard, /scanner, etc.), serve index.html
spa_routes = ['/home', '/dashboard', '/scanner', '/alerts', '/backtest', '/about']
        if any(clean_path.startswith(route) for route in spa_routes):
            self.serve_index()
            return
            
        # For all other non-existent paths, serve index.html (SPA fallback)
        self.serve_index()
    
    def serve_index(self):
        """Serve the index.html file"""
        try:
            with open('index.html', 'rb') as f:
                content = f.read()
                
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            
        except FileNotFoundError:
            self.send_error(404, "index.html not found")

def run_server(port=8000):
    """Run the SPA-friendly HTTP server"""
    handler = SPAHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"SPA Server running at http://localhost:{port}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    run_server()