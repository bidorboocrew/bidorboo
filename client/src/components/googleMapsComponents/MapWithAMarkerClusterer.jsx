import React from 'react';
import autoBind from 'react-autobind';

import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker,withScriptjs } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div
        style={{
          height: `400px`,
          boxShadow:
            '0 2px 2px 0 rgba(0, 0, 0, 0.14),0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
        }}
      />
    ),
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  return <TheMap {...props} />;
});
export default MapWithAMarkerClusterer;

class TheMap extends React.Component {
  render() {
    const { mapCenterPoint } = this.props;
    return (
      <GoogleMap defaultZoom={8} defaultCenter={mapCenterPoint}>
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
    // console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    // console.log(clickedMarkers);
  }
  onMarkerClustereringEnd(markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers();
    // console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    // console.log(clickedMarkers);
  }
  render() {
    const { markers, selectJobToBidOn } = this.props;
    if (markers && markers.length > 0) {
      const jobsMarkersOnTheMap = markers.map(marker => (
        <JobMarker selectJobToBidOn={selectJobToBidOn} key={marker._id} marker={marker} />
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
    autoBind(this, 'bidOnThisJob');
  }

  toggleShow() {
    this.setState({ showInfoBox: !this.state.showInfoBox });
  }

  bidOnThisJob() {
    const { marker, selectJobToBidOn } = this.props;
    selectJobToBidOn(marker);
  }


  render() {
    const { marker, selectJobToBidOn } = this.props;
    return (
      <Marker
        opacity={0.8}
        icon={require('../../assets/images/mapMarker.png')}
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
            <div
              style={{
                borderRadius: 4,
                padding: 2,
                width: 150
              }}
            >
              <div
                style={{
                  border: '1px solid #b5b5b5',
                  boxShadow:
                    ' 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
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
                    fontSize: 16,
                    fontColor: `#4a4a4a`,
                    backgroundColor: 'white',
                    padding: 8
                  }}
                >
                  {marker.title}
                </div>
                <a
                  onClick={this.bidOnThisJob}
                  className="button is-primary is-small has-text-right is-fullwidth"
                >
                  <span style={{ marginLeft: 4 }}>
                    <i className="fas fa-dollar-sign" /> Bid
                  </span>
                </a>
              </div>
            </div>
          </InfoBox>
        )}
      </Marker>
    );
  }
}
