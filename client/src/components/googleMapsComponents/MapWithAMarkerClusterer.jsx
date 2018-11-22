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
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div
        style={{
          height: `30rem`,
          boxShadow:
            '0 2px 2px 0 rgba(0, 0, 0, 0.14),0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
        }}
      />
    ),
    mapElement: <div style={{ height: '100%' }} />,
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
    return marker && marker.location ? (
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
            className="info-Box-map"
            options={{
              pixelOffset: new google.maps.Size(-50, -10),
              zIndex: 999,
              boxStyle: {
                padding: '0px 0px 0px 0px',
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
              },
              closeBoxURL: '',
              infoBoxClearance: new google.maps.Size(1, 1),
              isHidden: false,
              pane: 'mapPane',
              enableEventPropagation: true,
            }}
          >
            <div className="card is-clipped bdb-infoBoxCard">
              <header className="card-header">
                <p
                  style={{ borderBottom: '1px solid #dbdbdb', padding: '4px 0.75rem' }}
                  className="card-header-title"
                >
                  {marker.title}
                </p>
                <a
                  style={{ borderBottom: '1px solid #dbdbdb', padding: '4px 0.75rem' }}
                  onClick={this.toggleShow}
                  className="is-paddingless card-header-icon is-outline"
                >
                  <span style={{ color: '#a7a7a7' }} className="icon">
                    <i className="fa fa-times fa-w-12" />
                  </span>
                </a>
              </header>
              <div style={{ padding: '0.25rem 0.75rem' }} className="card-content">
                <div className="content">
                  <div>
                    <figure className="image is-48x48 is-marginless">
                      <img  alt="profile" src={marker._ownerRef.profileImage.url} />
                    </figure>
                  </div>
                  <div className="level-item">
                    <p className="has-text-weight-bold">{marker._ownerRef.displayName}</p>
                  </div>
                </div>
              </div>
              <footer style={{ padding: '2px' }} className="card-footer">
                <div className="card-footer-item is-paddingless">
                  {(!isLoggedIn || marker._ownerRef._id !== currentUserId) && (
                    <a
                      style={{ borderRadius: 0 }}
                      className="button is-primary is-fullwidth"
                      onClick={(e) => {
                        e.preventDefault();
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
                        <i className="fas fa-dollar-sign" /> Bid
                      </span>
                    </a>
                  )}
                  {isLoggedIn && marker._ownerRef._id === currentUserId && (
                    <a className="button is-static disabled is-fullwidth">My Request</a>
                  )}
                </div>
              </footer>
            </div>
          </InfoBox>
        )}
      </Marker>
    ) : null;
  }
}
