# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 19:16:24 2020

@author: Shahir
"""

import os
import json

import numpy as np
import geojson as gj

from hackmit2020.utils import get_rel_pkg_path
from hackmit2020.datasets import (PARSED_DATA, parse_weekly_mapped_data, get_weekly_visit_geojson)
from hackmit2020.category_stats import get_category_stats
from hackmit2020.timeseries import get_visit_forecast_geojson

ANALYTICS_OUT_DIR = get_rel_pkg_path("resources/analytics_cache")

print("Loading database")
week0_data = parse_weekly_mapped_data(PARSED_DATA[0])

print("Analyzing weekly visit counts")
out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-visit-counts-map.geojson")
if not os.path.exists(out_fname):
    out_data = get_weekly_visit_geojson(week0_data)
    with open(out_fname, 'w') as f:
        gj.dump(out_data, f)

print("Analyzing visit forecasts method 1")
out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-visit-avg-forecast-map.geojson")
if not os.path.exists(out_fname):
    out_data = get_visit_forecast_geojson(week0_data, method="avg")
    with open(out_fname, 'w') as f:
        gj.dump(out_data, f)

# print("Analyzing visit forecasts method 2")
# out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-visit-model-forecast-map.geojson")
# if not os.path.exists(out_fname):
#     out_data = get_visit_forecast_geojson(week0_data, method="model", progress=True)
#     with open(out_fname, 'w') as f:
#         gj.dump(out_data, f)

print("Analyzing category statistics")
out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-category-stats.json")
if not os.path.exists(out_fname):
    out_data = get_category_stats(week0_data)

    with open(out_fname, 'w') as f:
        json.dump(out_data, f)

print("Analyzing category statistics 2")
out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-category-stats-short.json")
if not os.path.exists(out_fname):
    out_data = get_category_stats(week0_data)
    keys = list(out_data.keys())
    vals = [out_data[k]["mean_median_dwell"] for k in keys]
    indices = np.argsort(vals)

    filtered_keys = [keys[n] for n in indices[-20:]]
    filtered_stats = {}
    for k in filtered_keys:
        filtered_stats[k] = out_data[k]
    
    with open(out_fname, 'w') as f:
        json.dump(filtered_stats, f)

    