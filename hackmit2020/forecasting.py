# -*- coding: utf-8 -*-
"""
Created on Sun Sep 20 01:38:45 2020

@author: skarnik
"""
import time

import pykka
from sklearn.metrics import mean_squared_error
from statsmodels.tsa.arima_model import ARIMA
import warnings

warnings.filterwarnings("ignore")

HOURS_PER_DAY = 24


# Assume hours_per_day_every_day has 168 hours per week and each element is an list of such lists
def compute_forecasted_visitors_per_hour(visitors_per_day_every_day, param):
    visitors_each_time_step = []
    for i in range(len(visitors_per_day_every_day)):
        visitors_each_time_step.append(visitors_per_day_every_day[i])
    model = ARIMA(visitors_each_time_step, order=param)
    model_fit = model.fit(disp=0)
    output = model_fit.forecast()
    yhat = output[0]

    return yhat[0]


# evaluate combinations of p, d and q values for an ARIMA model
def compute_best_param(dataset, p_values, d_values, q_values):
    actor_ref = Leader.start(dataset, p_values, d_values, q_values)
    actor_ref.tell([0, actor_ref])
    actor_ref.tell([1])
    time.sleep(0.1)
    best_cfg = None
    best_score = None
    answer = actor_ref.ask([4])
    if answer[0] == 0:
        best_cfg = answer[1]
        best_score = answer[2]
    while (best_cfg is None):
        answer = actor_ref.ask([4])
        if answer[0] == 0:
            best_cfg = answer[1]
            best_score = answer[2]
        time.sleep(0.5)
    return best_cfg


class Leader(pykka.ThreadingActor):
    def __init__(self, dataset, p_values, d_values, q_values):
        super().__init__()
        self.dataset = dataset
        self.p_values = p_values
        self.d_values = d_values
        self.q_values = q_values
        self.best_score = float("inf")
        self.best_cfg = None
        self.trials = 0
        self.num_trials = len(p_values) * len(d_values) * len(q_values)

    def on_receive(self, list_message):
        if list_message[0] == 0:
            self.reference = list_message[1]
        if list_message[0] == 1:
            self.start_process()
        if list_message[0] == 2:
            mse = list_message[1]
            if mse < self.best_score:
                self.best_score = mse
                self.best_cfg = list_message[2]
            self.trials = self.trials + 1
        if list_message[0] == 3:
            self.trials = self.trials + 1
        if list_message[0] == 4:
            if self.trials == self.num_trials:
                return [0, self.best_cfg, self.best_score]
            else:
                return [1]

        if self.trials == self.num_trials:
            print('Best ARIMA%s MSE=%.3f' % (self.best_cfg, self.best_score))

    def start_process(self):
        for p in self.p_values:
            for d in self.d_values:
                for q in self.q_values:
                    order = (p, d, q)
                    actor_ref = ComputeARIMAMSE.start(self.reference, self.dataset)
                    actor_ref.tell(order)


class ComputeARIMAMSE(pykka.ThreadingActor):
    def __init__(self, reference, dataset):
        super().__init__()
        self.reference = reference
        self.dataset = dataset

    def on_receive(self, order):
        return self.evaluate_arima_model(self.reference, self.dataset, order)

    def evaluate_arima_model(self, ref, X, arima_order):
        try:
            # prepare training dataset
            train_size = int(len(X) * 0.66)
            train, test = X[0:train_size], X[train_size:]
            history = [x for x in train]
            # make predictions
            predictions = list()
            for t in range(len(test)):
                model = ARIMA(history, order=arima_order)
                model_fit = model.fit(disp=0)
                yhat = model_fit.forecast()[0]
                predictions.append(yhat)
                history.append(test[t])

            # calculate out of sample error
            error = mean_squared_error(test, predictions)
            print('ARIMA%s MSE=%.3f' % (arima_order, error))
            ref.tell([2, error, arima_order])
            self.stop()

        except:
            ref.tell([3])
            self.stop()

dataset = [float(i) + (i % 2) for i in range(7)]
order = compute_best_param(dataset, range(5), range(2), range(5))
print(compute_forecasted_visitors_per_hour(dataset, order))