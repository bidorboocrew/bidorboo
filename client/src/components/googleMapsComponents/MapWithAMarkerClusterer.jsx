/*global google*/
import React from 'react';
import autoBind from 'react-autobind';

import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker /*,withScriptjs*/ } from 'react-google-maps';
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
            '0 2px 2px 0 rgba(0, 0, 0, 0.14),0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
        }}
      />
    ),
    mapElement: <div style={{ height: `100%` }} />,
  }),
  // withScriptjs,
  withGoogleMap
)((props) => {
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
    const { markers, selectJobToBidOn, currentUserId, isLoggedIn, showLoginDialog } = this.props;
    if (markers && markers.length > 0) {
      const jobsMarkersOnTheMap = markers.map((marker) => (
        <JobMarker
          selectJobToBidOn={selectJobToBidOn}
          key={marker._id}
          marker={marker}
          currentUserId={currentUserId}
          isLoggedIn={isLoggedIn}
          showLoginDialog={showLoginDialog}
        />
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
    const { marker, currentUserId, isLoggedIn, showLoginDialog } = this.props;
    return (
      <Marker
        opacity={0.8}
        icon={require('../../assets/images/mapMarker.png')}
        onClick={this.toggleShow}
        key={marker._id}
        position={{
          lng: marker.location.coordinates[0],
          lat: marker.location.coordinates[1],
        }}
      >
        {this.state.showInfoBox && (
          <InfoBox
            className="infoBox"
            options={{
              pixelOffset: new google.maps.Size(-140, 0),
              zIndex: null,
              boxStyle: {
                padding: '0px 0px 0px 0px',
              },
              closeBoxURL: '',
              infoBoxClearance: new google.maps.Size(1, 1),
              isHidden: false,
              pane: 'mapPane',
              enableEventPropagation: true,
            }}
          >
            <div class="card info-box-card">
              <div class="info-box-card-content info-box-wrap">
                <div class="media info-box-media">
                  <div class="media-left info-box-media-left">
                    <figure class="image is-43x43">
                      <img alt="profile" src={marker._ownerRef.profileImage.url} />
                    </figure>
                  </div>
                  <div class="info-box-text-wrap  media-content">
                    <p class="title is-6 info-box-title">{marker.title}</p>
                  </div>
                </div>
                <div className="info-box-close">
                  <a onClick={this.toggleShow} className=" is-outline is-small has-text-right">
                    <i className="fa fa-times fa-w-12" />
                  </a>
                </div>
              </div>
              <footer class=" action-btns card-footer">
                {(!isLoggedIn || marker._ownerRef._id !== currentUserId) && (
                  <i
                    className="button is-primary"
                    onClick={() => {
                      if (!isLoggedIn) {
                        showLoginDialog(true);
                      } else {
                        if (marker._ownerRef._id !== currentUserId) {
                          this.bidOnThisJob();
                        }
                      }
                    }}
                  >
                    <span style={{ marginLeft: 4 }}>
                      <i className="fas fa-dollar-sign" /> Bid Now
                    </span>
                  </i>
                )}
                {isLoggedIn &&
                  marker._ownerRef._id === currentUserId && (
                    <i className="button is-static disabled">My Job</i>
                  )}
              </footer>
            </div>
          </InfoBox>
        )}
      </Marker>
    );
  }
}
