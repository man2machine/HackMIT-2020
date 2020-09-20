# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 12:16:55 2020

@author: Shahir
"""

import json
from math import radians, cos, sin, asin, sqrt

import geojson as gj
import numpy as np
import pandas as pd

from sklearn.neighbors._ball_tree import BallTree
from hackmit2020.utils import get_rel_pkg_path

PARSED_DATA = [
    get_rel_pkg_path("resources/parsed_data/09-16-2020-weekly-mapped.json")
]


def parse_weekly_mapped_data(fname):
    with open(fname, 'r', encoding="utf-8") as f:
        data = json.load(f)
    return data


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


def get_closest_locations(query, query_lon, query_lat, data, number_output=10):
    lon_list = []
    lat_list = []
    id_list = []

    for entry in data:
        if str(entry["mapping"]["top_category"]) == query:
            lon = float(entry["mapping"]["longitude"])
            lat = float(entry["mapping"]["latitude"])
            id_sg = str(entry["record"]["safegraph_place_id"])
            lon_list.append(lon)
            lat_list.append(lat)
            id_list.append(id_sg)

    records = pd.DataFrame(data={
        'lat': lat_list,
        'lon': lon_list,
        'ids': id_list
    })

    bt = BallTree(np.deg2rad(records[['lat', 'lon']].values), metric='haversine')
    distances, indices = bt.query(np.deg2rad(np.c_[query_lat, query_lon]), number_output)

    features = []

    for index in indices[0]:
        props = {"safegraph_place_id": records['ids'][index]}
        coords = (records['lon'][index], records['lat'][index])
        feat = gj.Feature(
            geometry=gj.Point(coords),
            properties=props
        )
        features.append(feat)

    feat_coll = gj.FeatureCollection(features)
    return feat_coll


def choose_recommended_location(feat_coll, data):
    # The current filtering mechanism is choosing the closest location.
    return feat_coll[0]


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
