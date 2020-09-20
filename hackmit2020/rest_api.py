# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 22:39:39 2020

@author: Shahir
"""

import json

import numpy as np

from flask import Flask, Response, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from gevent.pywsgi import WSGIServer

from hackmit2020.datasets import PARSED_DATA, parse_weekly_mapped_data, get_closest_locations

app = Flask(__name__)

api = Api(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})

week0_data = parse_weekly_mapped_data(PARSED_DATA[0])

class AnalyticsAPI(Resource):
    def post(self):
        if request.is_json:
            data = request.get_json()
            
            if data["query_type"] == "closest_locs":
                lng = data["lng"]
                lat = data["lat"]
                query_cat = data.get("category")
                indices = get_closest_locations(week0_data, lng, lat, query_cat=query_cat)

                out = {
                    "indices": indices
                }

                return Response(json.dumps(out), status=200, mimetype='application/json')

            response = jsonify(status="Invalid request")
            response.status_code = 400
            return response
        
        response = jsonify(status="Request was not JSON")
        response.status_code = 400
        return response

api.add_resource(AnalyticsAPI, '/')

