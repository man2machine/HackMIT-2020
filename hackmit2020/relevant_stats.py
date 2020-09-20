# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 23:45:00 2020

@author: skarnik
"""

import json

def get_median_dwell_times(data):
    median_dwell_times = []
    
    for entry in range(len(data)):
        median_dwell_time = float(entry['record']['median_dwell'])
        median_dwell_times.append(median_dwell_time)
    
    return median_dwell_times

def get_categories(data):
    categories = set()
    
    for entry in data:
        categories.add(entry['mapping']['top_category'])
    
    return list(categories)

def get_stats_from_each_category(data):
    """
    This function returns the stats from each category

    """
    
    categories = get_categories(data)
    mean_of_median_dwell_times = {categories[i]:0 for i in range(len(categories))}
    mean_raw_visitor_counts = {categories[i]:0 for i in range(len(categories))}
    count = {categories[i]:0 for i in range(len(categories))}
    
    for entry in data:
        for category in categories:
            record_entry = entry['record']
            mapping_entry = entry['mapping']
            entry_category = mapping_entry['top_category']
            if entry_category and entry_category == category:
                mean_of_median_dwell_times[category] += float(record_entry['median_dwell'])
                mean_raw_visitor_counts[category] += int(record_entry['raw_visit_counts'])
                count[category] += 1
        
    for category in categories:
        if count[category] > 0:
            mean_of_median_dwell_times[category] = mean_of_median_dwell_times[category]/count[category]
            mean_raw_visitor_counts[category] = mean_raw_visitor_counts[category]/count[category]
    
    return {"mean_median_dwell": mean_of_median_dwell_times, "mean_raw_visitor_counts": mean_raw_visitor_counts}
