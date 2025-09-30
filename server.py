#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = int(os.getenv('PORT', '8000'))
OPEN_BROWSER = os.getenv('OPEN_BROWSER', '1')
class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    if str(OPEN_BROWSER).strip().lower() in ("1", "true", "yes", "y"):
        webbrowser.open(f"http://localhost:{PORT}")
    httpd.serve_forever()
