/*global google*/
import React from 'react';

import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&?v=3.exp&libraries=places,geometry,drawing',
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
      directions: [],
    };
    this.placesService = new google.maps.places.PlacesService(document.getElementById('placesmap'));
  }

  createMarkers = (places) => {
    let placesCluster = [];
    let pathLines = [];

    placesCluster =
      places &&
      places.map((place, index) => {
        // var image = {
        //   url: place.icon,
        //   size: new google.maps.Size(71, 71),
        //   origin: new google.maps.Point(0, 0),
        //   anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(25, 25),
        // };
        const Identifier = `${Math.random()}-${Math.random()}`;

        const placeImg =
          (place && place.photos && place.photos.length > 0 && place.photos[0].getUrl()) ||
          place.icon;

        return (
          <SurveyMarker
            key={`${Math.random()}-${Math.random()}`}
            opacity={1}
            placeImg={placeImg}
            placeName={place.name || 'no name'}
            title={place.name}
            icon={require('../../../assets/images/tesssst.png')}
            position={place.geometry.location}
          />
        );
      });

    this.setState({ thingsNearMe: placesCluster, directions: pathLines });
  };

  watchCurrentPosition = () => {
    const getCurrentPositionOptions = {
      maximumAge: 5000,
      timeout: 5000,
      enableHighAccuracy: true,
    };
    navigator.geolocation.watchPosition(
      (position) => {
        // ensure we do not UPDATE too often , user must move more than 300 meters to update
        const myPositionlat = this.state.position ? this.state.position.lat : null;
        const myPositionlng = this.state.position ? this.state.position.lng : null;
        const livePosition = { lat: position.coords.latitude, lng: position.coords.longitude };

        // do not refresh unless we moved more than 1 meters
        if (myPositionlat && myPositionlng) {
          const livePositionMarker = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

          if (
            window.google.maps.geometry.spherical.computeDistanceBetween(
              livePositionMarker,
              new google.maps.LatLng(myPositionlat, myPositionlng),
            ) <= 5
          ) {
            // do nothing
            return true;
          }
        }

        // ensure we do not UPDATE too often , user must move more than 300 meters to update
        this.setState({ position: livePosition }, () => {
          const request = {
            location: livePosition,
            radius: '500',
            type: ['restaurant'],
          };
          this.placesService.nearbySearch(request, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.createMarkers(results);
            }
          });
          // (res,status)=>(res,status)
        });
      },
      (error) => {
        console.log(error);
      },
      getCurrentPositionOptions,
    );
  };
  // componentDidMount() {
  //   // start watching location
  //   this.watchCurrentPosition();
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.obsessAboutMe !== this.props.obsessAboutMe && this.props.obsessAboutMe) {
      this.watchCurrentPosition();
    }
  }

  render() {
    const { mapCenterPoint } = this.props;
    const { position, thingsNearMe, directions } = this.state;

    /*  */
    return (
      <GoogleMap
        options={{
          streetViewControl: true,
        }}
        defaultZoom={16}
        center={mapCenterPoint}
      >
        {position && (
          <Marker
            opacity={1}
            icon={require('../../../assets/images/myLocation.png')}
            position={position}
            onClick={() => {}}
          />
        )}
        <MarkerClusterer
          maxZoom={18}
          defaultMaxZoom={18}
          defaultMinimumClusterSize={10}
          averageCenter
          enableRetinaIcons
          gridSize={100}
        >
          {thingsNearMe}
        </MarkerClusterer>
        {directions}
      </GoogleMap>
    );
  }
}

class SurveyMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showInfoBox: false };
  }
  toggleShowInfoBox = () => {
    this.setState({ showInfoBox: !this.state.showInfoBox });
  };

  render() {
    const { showInfoBox } = this.state;
    const infoBoxDom = showInfoBox ? (
      <JobInfoBox toggleShowInfoBox={this.toggleShowInfoBox} {...this.props} />
    ) : null;
    return (
      <Marker {...this.props} onClick={this.toggleShowInfoBox}>
        {infoBoxDom}
      </Marker>
    );
  }
}

export class JobInfoBox extends React.Component {
  render() {
    const { placeImg, placeName, toggleShowInfoBox } = this.props;

    const showSurveyCard = (
      <div
        onClick={toggleShowInfoBox}
        style={{ maxWidth: '20rem' }}
        className="card has-text-centered"
      >
        <div className="card-image">
          <figure className="card-image is-clipped">
            <img className="bdb-cover-img" src={placeImg} />
          </figure>
        </div>

        <div
          style={{ paddingLeft: 0, marginLeft: 0, paddingRight: 0, marginRight: 0 }}
          className="card-content"
        >
          <div className="content has-text-centered">
            <p className="title">{placeName}</p>
          </div>
        </div>
      </div>
    );

    return (
      <InfoBox
        className="info-Box-map"
        onClick={toggleShowInfoBox}
        options={{
          pixelOffset: new google.maps.Size(-50, -50),
          zIndex: 999,
          boxStyle: {
            zIndex: '30',
            padding: '0px 0px 0px 0px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
            background: 'white',
          },
          closeBoxURL: '',
          infoBoxClearance: new google.maps.Size(10, 10),
          isHidden: false,
          pane: 'mapPane',
          enableEventPropagation: true,
        }}
      >
        {showSurveyCard}
      </InfoBox>
    );
  }
}
