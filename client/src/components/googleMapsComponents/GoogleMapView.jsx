import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { compose, withProps } from 'recompose';

class MapView extends React.Component {
  render() {
    const { isMarkerShown, markers } = this.props;
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 45.4215, lng: -75.6972 }}
      >
        {markers}
      </GoogleMap>
    );
  }
}
export default compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  // withScriptjs,
  withGoogleMap
)(MapView);
