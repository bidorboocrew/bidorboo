import React from 'react';
import {
  // withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { compose, withProps, lifecycle } from 'recompose';
import autoBind from 'react-autobind';

import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';

export const AddressSearchBox = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();

          this.setState({
            places
          });
        }
      });
    }
  })
)(props => (
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        className="input is-fullwidth"
        type="text"
        placeholder="Customized your placeholder"
      />
    </StandaloneSearchBox>
    <ol>
      {props.places.map(
        ({ place_id, formatted_address, geometry: { location } }) => (
          <li key={place_id}>
            {formatted_address}
            {' at '}
            ({location.lat()}, {location.lng()})
          </li>
        )
      )}
    </ol>
  </div>
));
