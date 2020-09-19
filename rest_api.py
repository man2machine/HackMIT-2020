# -*- coding: utf-8 -*-
"""
Created on Sun Sep 15 00:19:29 2019

@author: Shahir
"""

import numpy as np
import json
import matplotlib
matplotlib.use('Agg')

from flask import Flask, Response, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from gevent.pywsgi import WSGIServer

app = Flask(__name__)

api = Api(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})

class AnalyticsAPI(Resource):
    def post(self):
        if request.is_json:
            data = request.get_json()
            
            return Response(json.dumps(data), status=200, mimetype='application/json')
        
        else:
            response = jsonify(status="Request was not JSON")
            response.status_code = 400
            return response

api.add_resource(AnalyticsAPI, '/')

# run the application
if __name__ == "__main__":
    http_server = WSGIServer(('localhost', 5000), app)
    http_server.serve_forever()
    app.run()