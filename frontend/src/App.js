import React from 'react';

// bootstrap but as components for react

import {
  Row,
  Col,
  Container,
  Card,
  InputGroup,
  FormControl,
  Table
} from "react-bootstrap";

// shahir's code and mapbox gl
import mapboxgl from "mapbox-gl";

import { add_visits_map, green_red_colormap } from './mapMaker'

// api is going to do get requests to fetch data from the back-end
// unfortunately it looks like the map geojson will be hardcoded in because it's too big
import { mock_data, mock_data_bar, mock_data_list, mock_list_cols, mock_cards} from './utils/api';
import MyBarChart from './components/barChart';
import MyLineChart from "./components/lineChart";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGVyc29uMTI3IiwiYSI6ImNrZmE2bWI2eTB0NXQydG83bXVwempsa3IifQ.jv4_i_eXbKFqpLZuc19S9w";

class App extends React.Component {
  // this runs at the very beginning of everything (initial values)
  // and can also do javascript raw stuff
  constructor(props) {
    super(props);
    this.state = {
      data: mock_data, // a mock to be removed
      data_bar: mock_data_bar, // a mock to be removed
      data_list: mock_data_list, // a mock to be removed
      data_list_cols: mock_list_cols, // this is a mock please fix this!
      lng: 300, // change me to be on boston
      lat: 44, // change me to be on boston
      zoom: 2, // change me to be on boston
      map: null,
      cards: mock_cards // please change this
    };

    console.log(this.state);
  }

  // this function runs on the initial load of the screen
  // it is meant as an initializer for DOM stuff
  // to do things when the state changes use componentDidChange i.e. look at docs
  // you can also map things in render() to variables (that's how you make it reactive etc)
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
      add_visits_map(map, green_red_colormap);
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

  // this runs on every frame and is the output that we will see
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
            <Col xs={6}>
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
            <Col xs={4}>
              <InputGroup
                className="mb-3"
                style={{
                  marginRight: "10px",
                }}
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              
              <Table
                responsive
                striped
                bordered
                hover
                style={{
                  overflow: "scroll",
                  display: "inline-block",
                  maxHeight: "340px",
                }}
              >
                <thead>
                  <tr>
                    {this.state.data_list_cols.map((item) => {
                      return <td>{item["title"]}</td>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.data_list.map((item) => {
                    // can be made a bit more nice with a generator
                    // note index of the elements regards the row while we care about col below
                    return (
                      <tr>
                        <td>{item[this.state.data_list_cols[0]["key"]]}</td>
                        <td>{item[this.state.data_list_cols[1]["key"]]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <MyBarChart data={this.state.data_bar} show={["uv"]} />
            </Col>
            <Col xs={4}>
              <MyLineChart  data={this.state.data} show={["amt"]} />
            </Col>
            <Col xs={4}>
              <MyBarChart data={this.state.data_bar} show={["pv"]} />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
