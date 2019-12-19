import React from 'react';
// https://tomchentw.github.io/react-google-maps/
import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker /*,withScriptjs*/ } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import RequestInfoBox from './RequestInfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
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
    this.state = { showInfoBoxForRequestId: '' };
  }

  showInfoBox = (request) => {
    this.setState(
      () => ({ showInfoBoxForRequestId: request._id }),
      () => {
        if (
          request &&
          request.location &&
          request.location.coordinates &&
          request.location.coordinates.length === 2 &&
          request.zoomOnInfo
        ) {
          request.zoomOnInfo(
            {
              lng: request.location.coordinates[0],
              lat: request.location.coordinates[1],
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
    this.setState({ showInfoBoxForRequestId: '' });
  };

  render() {
    const { requestsList, userDetails, isLoggedIn, showLoginDialog } = this.props;
    const { showInfoBoxForRequestId } = this.state;

    if (requestsList && requestsList.length > 0) {
      const requestsMarkersOnTheMap = requestsList.map((request) => (

        <RequestMarker
          showInfoBox={this.showInfoBox}
          closeInfoBox={this.closeInfoBox}
          showInfoBoxForRequestId={showInfoBoxForRequestId}
          key={request._id}
          request={request}
          userDetails={userDetails}
          isLoggedIn={isLoggedIn}
          showLoginDialog={showLoginDialog}
        />
      ));
      return <>{ requestsMarkersOnTheMap }</>;
      //   <MarkerClusterer
      //     defaultMinimumClusterSize={10}
      //     averageCenter
      //     enableRetinaIcons
      //     gridSize={60}
      //   >
      //     {requestsMarkersOnTheMap}
      //   </MarkerClusterer>
      // );
    }
    return null;
  }
}

class RequestMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showInfoBox: false };
  }
  toggleShowInfoBox = () => {
    const { request, showInfoBoxForRequestId, showInfoBox, closeInfoBox } = this.props;
    if (showInfoBoxForRequestId === request._id) {
      closeInfoBox();
    } else {
      showInfoBox(request);
    }
  };
  render() {
    const { request, showInfoBoxForRequestId } = this.props;

    // let imgurl = request && request._ownerRef ? request._ownerRef.profileImage.url : null;
    // var image = {
    //   url: imgurl,
    //   size: new google.maps.Size(80, 80),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(17, 34),
    //   scaledSize: new google.maps.Size(32, 32),
    // };
    if (
      request &&
      request.reactMapClusterRef &&
      request.location &&
      request.location.coordinates &&
      request.location.coordinates.length === 2
    ) {
      console.log(request.location.coordinates)
      const shouldShowInfoBox = showInfoBoxForRequestId === request._id;
      return (
        <Marker
          ref={request.reactMapClusterRef}
          opacity={0.8}
          icon={require('../../../assets/images/mapMarker.png')}
          onClick={this.toggleShowInfoBox}
          key={request._id}
          label={request.title}
          position={{
            lng: request.location.coordinates[0],
            lat: request.location.coordinates[1],
          }}
        >
          {shouldShowInfoBox && (
            <RequestInfoBox toggleShowInfoBox={this.toggleShowInfoBox} {...this.props} />
          )}
        </Marker>
      );
    } else {
      // do not render the marker
      return null;
    }
  }
}
