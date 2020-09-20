# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 22:39:48 2020

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
