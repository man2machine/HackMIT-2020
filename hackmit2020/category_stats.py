# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 23:45:00 2020

@author: skarnik
"""

import json
from hackmit2020.datasets import parse_time_string

def get_categories(data):
    categories = set()
    
    for entry in data:
        categories.add(entry["mapping"]["top_category"])
    
    return list(categories)

def get_category_stats(data):
    """
    This function returns the stats from each category
    """
    
    categories = get_categories(data)

    mean_of_median_dwell_times = {n: 0 for n in categories}
    mean_weekly_visitor_counts = {n: 0 for n in categories}
    weekly_counts = {n: 0 for n in categories}

    mean_daily_visitor_counts = {categories[i]: [0]*7 for i in range(len(categories))}
    daily_counts = {n: [0]*7 for n in categories}
    
    for entry in data:
        for category in categories:
            record_entry = entry["record"]
            mapping_entry = entry["mapping"]
            entry_category = mapping_entry["top_category"]

            if not (entry_category and entry_category == category):
                continue

            mean_of_median_dwell_times[category] += float(record_entry["median_dwell"])
            mean_weekly_visitor_counts[category] += int(record_entry["raw_visit_counts"])
            weekly_counts[category] += 1
            
            visits_by_day = json.loads(record_entry["visits_by_day"])
            start_weekday = parse_time_string(record_entry["date_range_start"]).weekday()
            for day, count in enumerate(visits_by_day):
                actual_day = (day + start_weekday) % 7
                mean_daily_visitor_counts[category][day] += visits_by_day[actual_day]
                daily_counts[category][actual_day] += 1
    
    for category in categories:
        if weekly_counts[category] > 0:
            mean_of_median_dwell_times[category] = mean_of_median_dwell_times[category]/weekly_counts[category]
            mean_weekly_visitor_counts[category] = mean_weekly_visitor_counts[category]/weekly_counts[category]
        for day, count in enumerate(daily_counts[category]):
            if count > 0:
                mean_daily_visitor_counts[category][day] = mean_daily_visitor_counts[category][day]/daily_counts[category][day]
    
    stats = {}
    for category in categories:
        stats[category] = {}
        stats[category]["mean_median_dwell"] = mean_of_median_dwell_times[category]
        stats[category]["mean_weekly_visitor_counts"] =  mean_weekly_visitor_counts[category]
        stats[category]["mean_daily_visitor_counts"] =  mean_daily_visitor_counts[category]
    
    return stats
