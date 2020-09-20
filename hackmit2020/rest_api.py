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

from hackmit2020.datasets import (PARSED_DATA, parse_weekly_mapped_data,
    get_closest_locations, get_entry_metadata, search_weekly_entries)
from hackmit2020.category_stats import get_category_stats

app = Flask(__name__)

api = Api(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})

week0_data = parse_weekly_mapped_data(PARSED_DATA[0])

class AnalyticsAPI(Resource):
    def post(self):
        if request.is_json:
            data = request.get_json()
            
            if data["query_type"] == "closest_locs":
                lng = data["longtitude"]
                lat = data["latitude"]
                query_cat = data.get("category")
                indices = get_closest_locations(week0_data, lng, lat, query_cat=query_cat)
                out = {
                    "indices": list(indices)
                }

                return Response(json.dumps(out), status=200, mimetype='application/json')
            
            if data["query_type"] == "record_detailed_data":
                method = data.get("forecast_method", "avg")
                if "index" in data:
                    index = data["index"]
                    out = get_entry_metadata(week0_data[index], method=method)
                elif "indices" in data:
                    indices = data["indices"]
                    out = []
                    for n in indices:
                        out.append(get_entry_metadata(week0_data[n]), method=method)
                else:
                    out = None

                return Response(json.dumps(out), status=200, mimetype='application/json')
            
            if data["query_type"] == "category_stats":
                out = get_category_stats(week0_data)
                return Response(json.dumps(out), status=200, mimetype='application/json')

            if data["query_type"] == "search":
                indices = search_weekly_entries(week0_data,
                    search_str=data.get("search_str", ""),
                    top_category=data.get("top_category"),
                    sub_category=data.get("sub_category"),
                    city=data.get("city"),
                    region=data.get("region"),
                    postal_code=data.get("postal_code")
                )

                out = indices
                return Response(json.dumps(out), status=200, mimetype='application/json')
            
            if data["query_type"] == "file_serve":
                out = None
                return Response(json.dumps(out), status=200, mimetype='application/json')

            response = jsonify(status="Invalid request")
            response.status_code = 400
            return response
        
        response = jsonify(status="Request was not JSON")
        response.status_code = 400
        return response

api.add_resource(AnalyticsAPI, '/')

