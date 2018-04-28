import React from 'react';
import autoBind from 'react-autobind';

import { compose, withProps, withHandlers, withState } from 'recompose';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withGoogleMap
)(props => {
  return <TheMap {...props} />;
});
export default MapWithAMarkerClusterer;

class TheMap extends React.Component {
  render() {
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 45.4215, lng: -75.6972 }}
      >
        <Cluster {...this.props} />
      </GoogleMap>
    );
  }
}

class Cluster extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this, 'onMarkerClustererClick', 'onMarkerClustereringEnd');
  }

  onMarkerClustererClick(markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers();
    console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    console.log(clickedMarkers);
  }
  onMarkerClustereringEnd(markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers();
    console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    console.log(clickedMarkers);
  }
  render() {
    const { markers } = this.props;
    if (markers && markers.length > 0) {
      const jobsMarkersOnTheMap = markers.map(marker => (
        <JobMarker key={marker._id} marker={marker} />
      ));
      return (
        <MarkerClusterer
          onClick={this.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={100}
          onClusteringEnd={this.onMarkerClustereringEnd}
        >
          {jobsMarkersOnTheMap}
        </MarkerClusterer>
      );
    }
    return null;
  }
}

class JobMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showInfoBox: false };
    autoBind(this, 'toggleShow');
  }

  toggleShow() {
    this.setState({ showInfoBox: !this.state.showInfoBox });
  }

  render() {
    const { marker } = this.props;
    return (
      <Marker
        onClick={this.toggleShow}
        key={marker._id}
        position={{
          lng: marker.location.coordinates[0],
          lat: marker.location.coordinates[1]
        }}
      >
        {this.state.showInfoBox && (
          <InfoBox
            onClick={this.toggleShow}
            onCloseClick={this.toggleShow}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
          >
            <React.Fragment>
              <div
                style={{
                  width: 150,
                  backgroundColor: `whitesmoke`,
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderTop: 'none',
                  boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)'
                }}
              >
                <a
                  onClick={this.toggleShow}
                  className="button is-outline is-small has-text-right is-fullwidth"
                >
                  <i className="fa fa-times fa-w-12" />
                </a>
                <div
                  style={{
                    padding: `2px`,
                    fontSize: `16px`,
                    fontColor: `#4a4a4a`
                  }}
                >
                  {marker.title}
                </div>
                <a
                  onClick={this.toggleShow}
                  className="button is-primary is-small has-text-right is-fullwidth"
                >
                  Bid
                </a>
              </div>
            </React.Fragment>
          </InfoBox>
        )}
      </Marker>
    );
  }
}
