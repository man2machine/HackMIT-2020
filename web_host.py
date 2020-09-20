# -*- coding: utf-8 -*-
"""
Created on Sun Sep 15 10:34:13 2019

@author: Shahir
"""

import webbrowser
from http.server import SimpleHTTPRequestHandler
import socketserver

PORT = 8000

if __name__ == '__main__':
    webbrowser.open_new_tab("http://localhost:8000/index.html")
    with socketserver.TCPServer(("localhost", PORT), SimpleHTTPRequestHandler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()
