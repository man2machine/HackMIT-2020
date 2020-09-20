# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 12:16:55 2020

@author: Shahir
"""

import json
import geojson as gj

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

if __name__ == '__main__':
    week0_data = parse_weekly_mapped_data(PARSED_DATA[0])
    out_data = get_weekly_visit_geojson(week0_data)
    with open(get_rel_pkg_path("resources/analytics_cache/09-16-2020-weekly-visit-counts.geojson"), 'w') as f:
        gj.dump(out_data, f)
    

