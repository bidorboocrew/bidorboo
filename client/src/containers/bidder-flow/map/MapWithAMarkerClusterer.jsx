import React from 'react';
// https://tomchentw.github.io/react-google-maps/
import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker /*,withScriptjs*/ } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import JobInfoBox from './JobInfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
    // googleMapURL:
    //   'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places,geometry',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div
        className="container"
        style={{
          height: `25rem`,
          boxShadow: '0px 5px 10px -3px rgba(0, 0, 0, 0.42)',
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
    const { mapCenterPoint, mapZoomLevel } = this.props;
    // https://developers.google.com/maps/documentation/javascript/localization
    // xxx restrict bounds to canada
    // const CANADA_BOUNDS = { north: 70, south: 41, west: -145, east: -51 };
    return (
      <GoogleMap
        options={{
          disableDefaultUI: true,
          streetViewControl: false,
          // restriction: {
          //   latLngBounds: CANADA_BOUNDS,
          //   strictBounds: false,
          // },
        }}
        defaultZoom={mapZoomLevel}
        zoom={mapZoomLevel}
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

  showInfoBox = (job) => {
    this.setState(
      () => ({ showInfoBoxForJobId: job._id }),
      () => {
        if (
          job &&
          job.location &&
          job.location.coordinates &&
          job.location.coordinates.length === 2 &&
          job.zoomOnInfo
        ) {
          job.zoomOnInfo(
            {
              lng: job.location.coordinates[0],
              lat: job.location.coordinates[1],
            },
            () => {
              const mapDiv = document.querySelector(`#bdb-map`);
              mapDiv && mapDiv.scrollIntoView && mapDiv.scrollIntoView();
            },
          );
        }
      },
    );
  };
  closeInfoBox = () => {
    this.setState({ showInfoBoxForJobId: '' });
  };

  render() {
    const { jobsList, userDetails, isLoggedIn, showLoginDialog } = this.props;
    const { showInfoBoxForJobId } = this.state;

    if (jobsList && jobsList.length > 0) {
      const jobsMarkersOnTheMap = jobsList.map((job) => (
        <JobMarker
          showInfoBox={this.showInfoBox}
          closeInfoBox={this.closeInfoBox}
          showInfoBoxForJobId={showInfoBoxForJobId}
          key={job._id}
          job={job}
          userDetails={userDetails}
          isLoggedIn={isLoggedIn}
          showLoginDialog={showLoginDialog}
        />
      ));
      return (
        <MarkerClusterer
          defaultMinimumClusterSize={10}
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
  toggleShowInfoBox = () => {
    const { job, showInfoBoxForJobId, showInfoBox, closeInfoBox, reactMapClusterRef } = this.props;
    if (showInfoBoxForJobId === job._id) {
      closeInfoBox();
    } else {
      showInfoBox(job);
    }
  };
  render() {
    const { job, showInfoBoxForJobId } = this.props;

    // let imgurl = job && job._ownerRef ? job._ownerRef.profileImage.url : null;
    // var image = {
    //   url: imgurl,
    //   size: new google.maps.Size(80, 80),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(17, 34),
    //   scaledSize: new google.maps.Size(32, 32),
    // };
    if (
      job &&
      job.reactMapClusterRef &&
      job.location &&
      job.location.coordinates &&
      job.location.coordinates.length === 2
    ) {
      const shouldShowInfoBox = showInfoBoxForJobId === job._id;
      return (
        <Marker
          ref={job.reactMapClusterRef}
          opacity={0.8}
          icon={require('../../../assets/images/mapMarker.png')}
          onClick={this.toggleShowInfoBox}
          key={job._id}
          label={job.title}
          position={{
            lng: job.location.coordinates[0],
            lat: job.location.coordinates[1],
          }}
        >
          {shouldShowInfoBox && (
            <JobInfoBox toggleShowInfoBox={this.toggleShowInfoBox} {...this.props} />
          )}
        </Marker>
      );
    } else {
      // do not render the marker
      return null;
    }
  }
}
