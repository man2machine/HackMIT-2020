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
