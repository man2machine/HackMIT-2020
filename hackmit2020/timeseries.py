# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 23:19:33 2020

@author: skarnik
"""

import json
import geojson as gj

from hackmit2020.forecasting import compute_best_param, compute_model_forecasted_visitors_per_hour

HOURS_PER_DAY = 24

def compute_avg_forecasted_visitors_per_hour(hours_per_day_per_week):
    avg_results_per_day = [0 for i in range(HOURS_PER_DAY)]
    
    for i in range(len(hours_per_day_per_week)):
        avg_results_per_day[i % HOURS_PER_DAY] += hours_per_day_per_week[i]
    
    return [a/(len(hours_per_day_per_week) / HOURS_PER_DAY) for a in avg_results_per_day]
    
def get_avg_forecast_visitors_per_hour(entry):
    avg_results_per_day = [0 for i in range(HOURS_PER_DAY)]
    str_visits_by_each_hour = entry['record']['visits_by_each_hour']
    if len(str_visits_by_each_hour) != 0:
        hours_per_day_per_week = json.loads(str_visits_by_each_hour)
        avg_results_per_day = compute_avg_forecasted_visitors_per_hour(hours_per_day_per_week)
        
    return [a for a in avg_results_per_day]

def get_model_forecast_visitors_per_hour(entry):
    hour_preds = []
    hours_data = json.loads(entry['record']['visits_by_each_hour'])
    for hour in range(HOURS_PER_DAY):
        visits_data = []
        i = hour
        while True:
            if i >= len(hours_data):
                break
            visits_data.append(hours_data[i])
            i += 7
        visits_data = visits_data*2
        order = compute_best_param(visits_data, range(5), range(2), range(5))
        next_pred = compute_model_forecasted_visitors_per_hour(visits_data, order)
        hour_preds.append(next_pred)
    return hour_preds

def get_hourly_forecast(entry, method="model"):
    if method == "avg":
        hourly_forecast = get_avg_forecast_visitors_per_hour(entry)
    elif method == "model":
        hourly_forecast = get_model_forecast_visitors_per_hour(entry)
    else:
        raise ValueError()
    return hourly_forecast

def get_visit_forecast_geojson(data, method="avg", progress=False):
    features = []
    for i in range(len(data)):
        entry = data[i]
        hourly_forecast = get_hourly_forecast(entry, method)
        props = {
            "hourly_forecasts": hourly_forecast,
            "index": i
        }
        coords = (float(entry["mapping"]["longitude"]), float(entry["mapping"]["latitude"]))
        feat = gj.Feature(
            geometry=gj.Point(coords),
            properties=props
        )
        features.append(feat)
        if progress:
            print(i)
    feat_coll = gj.FeatureCollection(features)
    return feat_coll
