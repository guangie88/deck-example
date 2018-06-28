import DeckGL, { LineLayer, ScatterplotLayer } from "deck.gl";
import { setParameters } from "luma.gl";
import React, { Component } from "react";

function getColor(d) {
  const z = d.start[2];
  const r = z / 2;
  return [(255 * (1 + r)) / 2, 128 * (1 - r), 255 * (1 - r), 255 * 1];
  // return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
}

function getSize(type) {
  if (type.search("major") >= 0) {
    return 100;
  }
  if (type.search("small") >= 0) {
    return 30;
  }
  return 60;
}

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      latitude: 1.32,
      longitude: 103.84,
      zoom: 11,
      maxZoom: 16,
      pitch: 0,
      bearing: 0
    };
  }

  _initialize(gl) {
    setParameters(gl, {
      blendFunc: [gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE],
      blendEquation: gl.FUNC_ADD
    });
  }

  render() {
    const { viewport, flightPaths, mrts, strokeWidth } = this.props;

    // if (!flightPaths || !mrts) {
    //   return null;
    // }

    if (!mrts) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: "mrts",
        data: mrts,
        radiusScale: 1,
        getPosition: d => d.coordinates,
        getColor: d => [255, 140, 0],
        getRadius: d => getSize(d.type),
        pickable: Boolean(this.props.onHover),
        onHover: this.props.onHover
      })
      // new LineLayer({
      //   id: 'flight-paths',
      //   data: flightPaths,
      //   strokeWidth,
      //   fp64: false,
      //   getSourcePosition: d => d.start,
      //   getTargetPosition: d => d.end,
      //   getColor,
      //   pickable: Boolean(this.props.onHover),
      //   onHover: this.props.onHover
      // })
    ];

    return (
      <DeckGL
        {...viewport}
        layers={layers}
        onWebGLInitialized={this._initialize}
      />
    );
  }
}
