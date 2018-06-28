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
  MRTS: "./stns.json", // eslint-disable-line
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
      mrts: null
    };

    readJsonUrl(DATA_URL.MRTS, (error, response) => {
      if (!error) {
        this.setState({ mrts: response });
        console.log("Loaded!");
      } else {
        console.log(error);
      }
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize.bind(this));
    this._resize();
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

  render() {
    const { viewport, mrts } = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {" "}
        <DeckGLOverlay
          viewport={viewport}
          strokeWidth={1}
          flightPaths={null}
          mrts={mrts}
        />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement("div")));
