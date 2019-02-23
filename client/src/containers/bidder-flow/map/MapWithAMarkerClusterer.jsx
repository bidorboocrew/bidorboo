/*global google*/
import React from 'react';

import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker /*,withScriptjs*/ } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import JobInfoBox from './JobInfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div
        id="googleMapId"
        style={{
          height: `100vh`,
          width: `100vw`,
        }}
      />
    ),
    mapElement: (
      <div
        id="bdb-map"
        style={{ height: '100%', boxShadow: '0px 5px 10px -3px rgba(0, 0, 0, 0.42)' }}
      />
    ),
  }),
  withGoogleMap,
)((props) => {
  return <TheMap {...props} />;
});
export default MapWithAMarkerClusterer;

class TheMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      thingsNearMe: [],
    };
    this.service = new google.maps.places.PlacesService(document.getElementById('placesmap'));
  }

  createMarkers = (places) => {
    let placesCluster = [];
    debugger;

    placesCluster =
      places &&
      places.map((place) => {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        return (
          <Marker
            opacity={0.8}
            title={place.name}
            // icon={image}
            icon={require('../../../assets/images/mapMarker.png')}
            position={place.geometry.location}
            onClick={() => {}}
          />
        );
      });

    for (var i = 0, place; (place = places[i]); i++) {}
    debugger;
    this.setState({ thingsNearMe: placesCluster });
  };
  callback = (results, status) => {
    debugger;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.createMarkers(results);
    }
  };
  watchCurrentPosition = () => {
    const getCurrentPositionOptions = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true,
    };
    navigator.geolocation.watchPosition(
      (position) => {
        const currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };

        this.setState({ position: currentPosition }, () => {
          const request = {
            location: currentPosition,
            radius: '500',
            type: ['restaurant'],
          };
          this.service.nearbySearch(request, this.callback);
          // (res,status)=>(res,status)
        });
      },
      (error) => {
        console.log(error);
      },
      getCurrentPositionOptions,
    );
  };
  componentDidMount() {
    // start watching location
    this.watchCurrentPosition();
  }
  render() {
    const { mapCenterPoint } = this.props;
    const { position, thingsNearMe } = this.state;
    /*  */
    return (
      <GoogleMap
        options={{
          streetViewControl: true,
        }}
        defaultZoom={20}
        center={mapCenterPoint}
      >
        {position && (
          <Marker
            opacity={0.8}
            icon={require('../../../assets/images/mapMarker.png')}
            position={position}
            onClick={() => {}}
          />
        )}
        <MarkerClusterer
          defaultMinimumClusterSize={3}
          averageCenter
          enableRetinaIcons
          gridSize={100}
        >
          {thingsNearMe}
        </MarkerClusterer>
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
          userDetails={userDetails}
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
  toggleShowInfoBox = () => {
    const { job, showInfoBoxForJobId, showInfoBox, closeInfoBox } = this.props;
    if (showInfoBoxForJobId === job._id) {
      closeInfoBox();
    } else {
      showInfoBox(job._id);
    }
  };
  render() {
    const { job, showInfoBoxForJobId } = this.props;
    if (job && job.location && job.location.coordinates && job.location.coordinates.length === 2) {
      const shouldShowInfoBox = showInfoBoxForJobId === job._id;
      return (
        <Marker
          opacity={0.8}
          icon={require('../../../assets/images/mapMarker.png')}
          onClick={this.toggleShowInfoBox}
          key={job._id}
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
