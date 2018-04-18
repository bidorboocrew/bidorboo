import React from 'react';
import {
  // withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { compose, withProps } from 'recompose';

// https://tomchentw.github.io/react-google-maps/#infobox
const MyMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  // withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: 45.4215, lng: -75.6972 }}>
    {props.isMarkerShown && (
      <Marker
        position={{ lat: 45.4215, lng: -75.6972 }}
        onClick={props.onMarkerClick}
      >
        {props.showInfo && (
          <InfoBox
            onCloseClick={props.onToggleOpen}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
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
                Hello, Yacoub! isn't this awesome
              </div>
            </div>
          </InfoBox>
        )}
      </Marker>
    )}
  </GoogleMap>
));

class GeoMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, address: '' };
    this.toggleShow = () => {
      this.setState({ show: !this.state.show });
    };
  }

  render() {
    return (
      <MyMapComponent
        showInfo={this.state.show}
        isMarkerShown={true}
        onMarkerClick={this.toggleShow}
      />
    );
  }
}

export default GeoMap;
