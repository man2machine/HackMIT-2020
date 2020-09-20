# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 23:19:33 2020

@author: skarnik
"""

import json
import geojson as gj

HOURS_PER_DAY = 24

def compute_forecasted_visitors_per_hour(hours_per_day_per_week):
    avg_results_per_day = [0 for i in range(HOURS_PER_DAY)]
    
    for i in range(len(hours_per_day_per_week)):
        avg_results_per_day[i % HOURS_PER_DAY] += hours_per_day_per_week[i]
    
    return [a/(len(hours_per_day_per_week) / HOURS_PER_DAY) for a in avg_results_per_day]
    
def get_avg_forecast_visitors_per_hour(entry):
    avg_results_per_day = [0 for i in range(HOURS_PER_DAY)]
    str_visits_by_each_hour = entry['record']['visits_by_each_hour']
    if len(str_visits_by_each_hour) != 0:
        hours_per_day_per_week = json.loads(str_visits_by_each_hour)
        avg_results_per_day = compute_forecasted_visitors_per_hour(hours_per_day_per_week)
        
    return [a for a in avg_results_per_day]

def get_visit_forecast_geojson(data):
    features = []
    for i in range(len(data)):
        entry = data[i]
        hourly_forecast = get_avg_forecast_visitors_per_hour(entry)
        props = {
            "hourly_forecasts": hourly_forecast,
        }
        coords = (float(entry["mapping"]["longitude"]), float(entry["mapping"]["latitude"]))
        feat = gj.Feature(
            geometry=gj.Point(coords),
            properties=props
        )
        features.append(feat)
    feat_coll = gj.FeatureCollection(features)
    return feat_coll
