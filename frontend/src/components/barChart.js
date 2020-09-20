import React from 'react';

// this is the basic plotting framework we are using (hopefully) instead of d3

import {
  BarChart,
  Tooltip,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export default class MyBarChart extends React.Component {
    render() {
        <BarChart width={400} height={200} data={this.props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {this.props.show.map((item) => {
            return (
                <Bar dataKey={item} fill="#82ca9d" />
            )
        })}
        </BarChart>
    }
}