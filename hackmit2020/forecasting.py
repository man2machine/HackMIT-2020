# -*- coding: utf-8 -*-
"""
Created on Sun Sep 20 01:38:45 2020

@author: skarnik
"""

from statsmodels.tsa.arima_model import ARIMA

HOURS_PER_DAY = 24

# Assume hours_per_day_every_day has 168 hours per week and each element is an list of such lists
def compute_forecasted_visitors_per_hour(visitors_per_day_every_day, p, d, q):
    visitors_each_time_step = []
    for i in range(len(visitors_per_day_every_day)):
        visitors_each_time_step.append(visitors_per_day_every_day[i])
    model = ARIMA(visitors_each_time_step, order=(p, d, q))
    model_fit = model.fit(disp=0)
    output = model_fit.forecast()
    yhat = output[0]
    
    return yhat[0]

print(compute_forecasted_visitors_per_hour([float(i) + (i%2) for i in range(1000)], 5, 1, 0))