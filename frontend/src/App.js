import React from 'react';

import { Row, Col, Container, Card } from "react-bootstrap";

import {
  LineChart,
  BarChart,
  Tooltip,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import mapboxgl from "mapbox-gl";

import { mock_data, mock_data_bar } from './api';

mapboxgl.accessToken =
  "pk.eyJ1IjoicGVyc29uMTI3IiwiYSI6ImNrZmE2bWI2eTB0NXQydG83bXVwempsa3IifQ.jv4_i_eXbKFqpLZuc19S9w";


function add_visits_map(map, green_red_colormap) {
  map.addSource("test", {
    type: "geojson",
    data: "09-16-2020-weekly-visit-counts-map.geojson",
  });

  map.addLayer({
    id: "heatmap",
    type: "circle",
    source: "test",
    paint: {
      "circle-radius": {
        base: 1.75,
        stops: [
          [12, 2],
          [22, 10],
        ],
      },
      // https://www.schemecolor.com/red-orange-green-gradient.php
      "circle-color": [
        "case",
        [">", ["get", "week_visits"], 50],
        green_red_colormap[5],
        [">", ["get", "week_visits"], 40],
        green_red_colormap[4],
        [">", ["get", "week_visits"], 30],
        green_red_colormap[3],
        [">", ["get", "week_visits"], 20],
        green_red_colormap[2],
        [">", ["get", "week_visits"], 10],
        green_red_colormap[1],
        [">", ["get", "week_visits"], 0],
        green_red_colormap[0],
        "#cccccc",
      ],
    },
  });
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: mock_data,
      data_bar: mock_data_bar,
      lng: 300,
      lat: 44,
      zoom: 2,
      map: null,
      cards: {
        "pasta" : 31,
        "pizza" : 22
      }
    };
  }

  componentDidMount() {
    let map = new mapboxgl.Map({
        container: this.mapContainer,
        style: "mapbox://styles/mapbox/light-v10",
        center: [this.state.lng, this.state.lat],
        zoom: this.state.zoom,
      })
    
    map.addControl(new mapboxgl.NavigationControl());
    map.dragPan.enable();

    map.on("load", function () {
      add_visits_map(map, [
        "#69B34C",
        "#ACB334",
        "#FAB733",
        "#FF8E15",
        "#FF4E11",
        "#FF0D0D",
      ]);
    });
    
    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    this.setState({
        map: map
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          This is a cool visualization.
        </h1>
        <Container fluid>
          <Row
            style={{
              marginBottom: "40px",
            }}
          >
            <Col xs={2}>
              <Card
                style={{
                  marginBottom: "20px",
                }}
              >
                <Card.Header as="h5">Featured</Card.Header>
                <Card.Title>Number of Pastas Eaten</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Important
                </Card.Subtitle>
                <Card.Text>{this.state.cards["pasta"]}</Card.Text>
              </Card>
              <Card>
                <Card.Header as="h5">Featured</Card.Header>
                <Card.Title>Number of Pizzas Eaten</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Less Important
                </Card.Subtitle>
                <Card.Text>{this.state.cards["pizza"]}</Card.Text>
              </Card>
            </Col>
            <Col xs={8}>
              <div
                ref={(el) => (this.mapContainer = el)}
                style={{
                  height: 400,
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              />
            </Col>
            <Col xs={2}>
              <p>search</p>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <BarChart width={400} height={200} data={this.state.data_bar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </Col>
            <Col xs={4}>
              <LineChart width={400} height={200} data={this.state.data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="amt" stroke="#000000" />
              </LineChart>
            </Col>
            <Col xs={4}>
              <BarChart width={400} height={200} data={this.state.data_bar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pv" fill="#8884d8" />
              </BarChart>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
