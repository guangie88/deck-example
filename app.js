/* global document */
import { json as readJsonUrl } from "d3-request";
import DeckGL, { LineLayer, ScatterplotLayer } from "deck.gl";
import React, { Component } from "react";
import { render } from "react-dom";
import MapGL from "react-map-gl";

import DeckGLOverlay from "./deckgl-overlay";

// Set your mapbox token here
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ3VhbmdpZSIsImEiOiJjaml4N2gxOGowMDN5M3FwaHJqOGZobGdkIn0.IXqf-xh73aRmPpNRVOzBRg"; // eslint-disable-line

// Source data CSV
const DATA_URL = {
  DATA0: "./data0.json", // eslint-disable-line
  DATA1: "./data1.json", // eslint-disable-line
  FLIGHT_PATHS: "./route_temp.json" // eslint-disable-line
};

const INITIAL_VIEW_STATE = {
  latitude: 1.351267595658125,
  longitude: 103.82148508241478,
  zoom: 10.3,
  bearing: 0,
  pitch: 0
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: INITIAL_VIEW_STATE,
      width: 500,
      height: 500,
      
      data: null,
      data0: null,
      data1: null,
      seconds: 0,
    };

    readJsonUrl(DATA_URL.DATA0, (error, response) => {
      if (!error) {
        this.setState({ data: response, data0: response });

        // set interval firing after the first load
        this.interval = setInterval(() => this._tick(), 1000);
      } else {
        console.log(error);
      }
    });

    readJsonUrl(DATA_URL.DATA1, (error, response) => {
      if (!error) {
        this.setState({ data1: response });
      } else {
        console.log(error);
      }
    });
  }

  _tick() {
    this.setState(prevState => {
      const nextData = prevState.seconds % 2 == 0
        ? this.state.data0
        : this.state.data1;

      return {
        data: nextData,
        seconds: prevState.seconds + 1
      };
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({ viewport: { ...this.state.viewport, ...viewport } });
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize.bind(this));
    this._resize();

    // shifted into 
    // this.interval = setInterval(() => this._tick(), 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log(`Seconds: ${this.state.seconds}`);

    const { viewport, data } = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay
          viewport={viewport}
          strokeWidth={1}
          flightPaths={null}
          points={data}
        />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement("div")));
