import React from "react";

// this is the basic plotting framework we are using (hopefully) instead of d3

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

class MyLineChart extends React.Component {
    render() {
        return (
          <LineChart width={400} height={200} data={this.props.data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            {this.props.show.map((item) => {
              return (
                <Line type="monotone" dataKey={item} stroke="#000000" />
              )
            })}
          </LineChart>
        )
    }
}

export default MyLineChart