# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 22:39:30 2020

@author: Shahir
"""

from gevent.pywsgi import WSGIServer

from hackmit2020.rest_api import app

# run the application
if __name__ == "__main__":
    http_server = WSGIServer(('localhost', 5000), app)
    http_server.serve_forever()
    app.run(debug=True)