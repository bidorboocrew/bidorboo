/*global google*/
import React from 'react';

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
          height: `25rem`,
          boxShadow:
            '0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
        }}
      />
    ),
    mapElement: <div id="bdb-map" style={{ height: '100%' }} />,
  }),
  withGoogleMap,
)((props) => {
  return <TheMap {...props} />;
});
export default MapWithAMarkerClusterer;

class TheMap extends React.Component {
  render() {
    const { mapCenterPoint } = this.props;
    return (
      <GoogleMap
        options={{
          disableDefaultUI: true,
          streetViewControl: false,
        }}
        defaultZoom={8}
        center={mapCenterPoint}
      >
        <Cluster {...this.props} />
      </GoogleMap>
    );
  }
}

class Cluster extends React.Component {
  // onMarkerClustererClick = (markerClusterer) => {
  //   const clickedMarkers = markerClusterer.getMarkers();
  // };
  // onMarkerClustereringEnd = (markerClusterer) => {
  //   const clickedMarkers = markerClusterer.getMarkers();
  // };
  constructor(props) {
    super(props);
    this.state = { showInfoBoxForJobId: '' };
  }

  showInfoBox = (jobId) => {
    this.setState({ showInfoBoxForJobId: jobId });
  };
  closeInfoBox = () => {
    this.setState({ showInfoBoxForJobId: '' });
  };

  render() {
    const { jobsList, selectJobToBidOn, userDetails, isLoggedIn, showLoginDialog } = this.props;
    const { showInfoBoxForJobId } = this.state;

    if (jobsList && jobsList.length > 0) {
      const jobsMarkersOnTheMap = jobsList.map((job) => (
        <JobMarker
          showInfoBox={this.showInfoBox}
          closeInfoBox={this.closeInfoBox}
          showInfoBoxForJobId={showInfoBoxForJobId}
          selectJobToBidOn={selectJobToBidOn}
          key={job._id}
          job={job}
          currentUserId={userDetails._id}
          isLoggedIn={isLoggedIn}
          showLoginDialog={showLoginDialog}
        />
      ));
      return (
        <MarkerClusterer
          defaultMinimumClusterSize={3}
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
  }

  bidOnThisJob = () => {
    const { job, selectJobToBidOn } = this.props;
    selectJobToBidOn(job);
  };
  toggleShow = () => {
    const { job, showInfoBoxForJobId, showInfoBox, closeInfoBox } = this.props;
    if (showInfoBoxForJobId === job._id) {
      closeInfoBox();
    } else {
      showInfoBox(job._id);
    }
  };
  render() {
    const { job, currentUserId, isLoggedIn, showLoginDialog, showInfoBoxForJobId } = this.props;
    if (job && job.location && job.location.coordinates && job.location.coordinates.length === 2) {
      const shouldShowInfoBox = showInfoBoxForJobId === job._id;
      return (
        <Marker
          opacity={0.8}
          icon={require('../../../assets/images/mapMarker.png')}
          onClick={this.toggleShow}
          key={job._id}
          position={{
            lng: job.location.coordinates[0],
            lat: job.location.coordinates[1],
          }}
        >
          {shouldShowInfoBox && (
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
                enableEventPropagation: false,
              }}
            >
              <div className="card is-clipped bdb-infoBoxCard">
                <header className="card-header">
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
                        <img alt="profile" src={job._ownerRef.profileImage.url} />
                      </figure>
                    </div>
                    <div className="level-item">
                      <p className="has-text-weight-bold">{job._ownerRef.displayName}</p>
                    </div>
                  </div>
                </div>
                <footer style={{ padding: '2px' }} className="card-footer">
                  <div className="card-footer-item is-paddingless">
                    {(!isLoggedIn || job._ownerRef._id !== currentUserId) && (
                      <a
                        style={{ borderRadius: 0 }}
                        className="button is-primary is-fullwidth"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isLoggedIn) {
                            showLoginDialog(true);
                          } else {
                            if (job._ownerRef._id !== currentUserId) {
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
                    {isLoggedIn && job._ownerRef._id === currentUserId && (
                      <a className="button is-static disabled is-fullwidth">My Request</a>
                    )}
                  </div>
                </footer>
              </div>
            </InfoBox>
          )}
        </Marker>
      );
    } else {
      // do not render the marker
      return null;
    }
  }
}
