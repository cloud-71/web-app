import React, { Component, createRef } from 'react';
import { Map, TileLayer } from 'react-leaflet';
//Placeholder for geojson data
import data from '../res/out2.json';

class MyMap extends Component {
  state = {
    center: {
      lat: -34.7479,
      lng: 149.7277,
    },
    marker: {
      lat: -34.7479,
      lng: 149.7277,
    },
    zoom: 12,
    draggable: true,
  };

  render() {
    const mapPos = [this.state.center.lat, this.state.center.lng];

    return (
      <div className="leafmap">
        <Map
          center={mapPos}
          zoom={this.state.zoom}
          style={{
            height: '400px',
          }}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}

export default MyMap;
