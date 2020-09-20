# -*- coding: utf-8 -*-
"""
Created on Sat Sep 19 19:16:24 2020

@author: Shahir
"""

import os
import geojson as gj

from hackmit2020.utils import get_rel_pkg_path

from hackmit2020.datasets import (PARSED_DATA, parse_weekly_mapped_data, get_weekly_visit_geojson)

ANALYTICS_OUT_DIR = get_rel_pkg_path("resources/analytics_cache")

week0_data = parse_weekly_mapped_data(PARSED_DATA[0])

out_fname = os.path.join(ANALYTICS_OUT_DIR, "09-16-2020-weekly-visit-counts-map.geojson")
if not os.path.exists(out_fname):
    out_data = get_weekly_visit_geojson(week0_data)
    with open(out_fname, 'w') as f:
        gj.dump(out_data, f)
