import DeckGL, { ScatterplotLayer } from "deck.gl";
import { setParameters } from "luma.gl";
import React, { Component } from "react";

function getSize(type) {
  if (type.search("major") >= 0) {
    return 120;
  }

  if (type.search("small") >= 0) {
    return 40;
  }

  return 80;
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
    const { viewport, points } = this.props;

    if (!points) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: "points",
        data: points,
        radiusScale: 1,
        getPosition: d => d.coordinates,
        getColor: d => [255, 140, 0],
        getRadius: d => getSize(d.type),
        pickable: Boolean(this.props.onHover),
        onHover: this.props.onHover
      })
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
