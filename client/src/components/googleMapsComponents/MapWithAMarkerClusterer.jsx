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
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      debugger;
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    }
  }),
  withGoogleMap
)(props => {
  const { showInfoBox, toggleInfoBox, onMarkerClustererClick, markers } = props;
  return (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: 45.4215, lng: -75.6972 }}>
      <Cluster fields={props} />
    </GoogleMap>
  );
});
export default MapWithAMarkerClusterer;

class Cluster extends React.Component {
  render() {
    const { fields } = this.props;
    const {
      showInfoBox,
      toggleInfoBox,
      onMarkerClustererClick,
      markers
    } = fields;
    if (markers && markers.length > 0) {
      debugger;
      const jobsMarkersOnTheMap = markers.map(marker => <JobMarker key={marker._id} marker={marker} />);
      return (
        <MarkerClusterer
        maxZoom={1}
          onClick={onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={100}
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
            options={{ closeBoxURL: ``, enableEventPropagation: false }}
          >
            <div
              style={{
                backgroundColor: `whitesmoke`,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                // opacity: 0.8,
                padding: `12px`
              }}
            >
              <div style={{ fontSize: `16px`, fontColor: `#4a4a4a` }}>
                {marker.title}
              </div>
            </div>
          </InfoBox>
        )}
      </Marker>
    );
  }
}
