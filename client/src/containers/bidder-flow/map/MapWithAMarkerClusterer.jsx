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
    const myPositionlat = this.state.position.lat;
    const myPositionlng = this.state.position.lng;
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
        return (
          <SurveyMarker
            key={`${Math.random()}-${Math.random()}`}
            opacity={0.8}
            title={place.name}
            icon={require('../../../assets/images/rsz_1surveymonkey-logo.png')}
            position={place.geometry.location}
          />
        );
      });

    // pathLines =
    //   places &&
    //   places.map((place, index) => {
    //     const lat = place.geometry.location.lat();
    //     const lng = place.geometry.location.lng();
    //     const xPath = [
    //       new google.maps.LatLng(myPositionlat, myPositionlng),
    //       new google.maps.LatLng(lat, lng),
    //     ];
    //     return (
    //       <Polyline
    //         key={index}
    //         defaultDraggable={false}
    //         defaultEditable={false}
    //         defaultVisible={true}
    //         draggable={false}
    //         editable={false}
    //         options={{
    //           strokeColor: '#00BF6F',
    //           strokeWeight: 1,
    //           visible: true,
    //           strokeOpacity: 0.4,
    //         }}
    //         path={xPath}
    //         visible={false}
    //       />
    //     );
    //   });

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
        const currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };

        this.setState({ position: currentPosition }, () => {
          const request = {
            location: currentPosition,
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
  componentDidMount() {
    // start watching location
    this.watchCurrentPosition();
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
            icon={require('../../../assets/images/mapMarker.png')}
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
    debugger;
    this.setState({ showInfoBox: !this.state.showInfoBox });
  };

  render() {
    const { showInfoBox } = this.state;
    const infoBoxDom = showInfoBox ? (
      <JobInfoBox toggleShowInfoBox={this.toggleShowInfoBox} />
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
    // const {

    // } = this.props;
    const showSurveyCard = (
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">John Smith</p>
              <p class="subtitle is-6">@johnsmith</p>
            </div>
          </div>

          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.{' '}
            <a>@bulmaio</a>.
          </div>
        </div>
      </div>
    );

    return (
      <InfoBox
        className="info-Box-map"
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
