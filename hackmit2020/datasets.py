# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 12:16:55 2020

@author: Shahir
"""

import os
import json
from math import radians, cos, sin, asin, sqrt

import datetime
import dateutil.parser
import geojson as gj
import numpy as np
import pandas as pd

from sklearn.neighbors._ball_tree import BallTree
from hackmit2020.utils import get_rel_pkg_path
from hackmit2020.timeseries import get_avg_forecast_visitors_per_hour

PARSED_DATA = [
    get_rel_pkg_path("resources/parsed_data/09-16-2020-weekly-mapped.json")
]

os.makedirs(get_rel_pkg_path("resources/parsed_data"), exist_ok=True)
os.makedirs(get_rel_pkg_path("resources/analytics_cache"), exist_ok=True)
os.makedirs(get_rel_pkg_path("resources/web_cache"), exist_ok=True)

def parse_weekly_mapped_data(fname):
    with open(fname, 'r', encoding="utf-8") as f:
        data = json.load(f)
    return data

def parse_time_string(time_str):
    return dateutil.parser.parse(time_str)

def get_entry_metadata(
    entry,
    include_categories=True,
    include_desc=True):
    
    props = {}

    copy_fields1 = ["location_name", "street_address", "city", "region", "postal_code"]
    for key in copy_fields1:
        props[key] = entry["record"][key]
    
    props["medial_dwell"] = float(entry["record"]["median_dwell"])
    props["visits_by_day"] = json.loads(entry["record"]["visits_by_day"])
    props["visits_by_each_hour"] = json.loads(entry["record"]["visits_by_each_hour"])
    props["date_start"] = entry["record"]["date_range_start"]
    props["date_end"] = entry["record"]["date_range_end"]

    copy_fields2 = ["top_category", "sub_category", "latitude", "longitude", "postal_code"]
    for key in copy_fields2:
        props[key] = entry["mapping"][key]
    
    forecast_info = get_avg_forecast_visitors_per_hour(entry)
    props["forecast_info"] = forecast_info

    return props

def get_weekly_visit_geojson(data):
    features = []
    for entry in data:
        props = {
            "week_visits": int(entry["record"]["raw_visit_counts"]), 
        }
        coords = (float(entry["mapping"]["longitude"]), float(entry["mapping"]["latitude"]))
        feat = gj.Feature(
            geometry=gj.Point(coords),
            properties=props
        )
        features.append(feat)
    
    feat_coll = gj.FeatureCollection(features)
    return feat_coll

def get_closest_locations(data, query_lon, query_lat, query_cat=None, query_subcat=None, number_output=10):
    bt_lons = []
    bt_lats = []
    bt_indices = []

    for n, entry in enumerate(data):
        valid = True
        if query_cat is not None and str(entry["mapping"]["top_category"]) != query_cat:
            valid = False
        if query_subcat is not None and str(entry["mapping"]["sub_category"]) != query_subcat:
            valid = False
        
        if not valid:
            break

        lon = float(entry["mapping"]["longitude"])
        lat = float(entry["mapping"]["latitude"])
        bt_lons.append(lon)
        bt_lats.append(lat)
        bt_indices.append(n)
    
    bt_lons = np.array(bt_lons)
    bt_lats = np.array(bt_lats)
    bt_indices = np.array(bt_indices)

    number_output = min(number_output, len(bt_indices))
    if number_output == 0:
        return []
    
    records = pd.DataFrame(data={
        'lon': bt_lons,
        'lat': bt_lats,
        'index': bt_indices
    })

    bt = BallTree(np.deg2rad(records[['lat', 'lon']].values), metric='haversine')
    distances, indices = bt.query(np.deg2rad(np.c_[query_lat, query_lon]), number_output)

    data_indices = bt_indices[indices[0]].tolist()

    return data_indices

def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 3956
    return c * r

if __name__ == '__main__':
    week0_data = parse_weekly_mapped_data(PARSED_DATA[0])
    out_data = get_weekly_visit_geojson(week0_data)
    with open(get_rel_pkg_path("resources/analytics_cache/09-16-2020-weekly-visit-counts.geojson"), 'w') as f:
        gj.dump(out_data, f)
