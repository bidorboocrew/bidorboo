import React from 'react';
import {
  // withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { compose, withProps } from 'recompose';
import autoBind from 'react-autobind';

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
    {props.isMarkerShown && <React.Fragment>{props.markers}</React.Fragment>}
  </GoogleMap>
));

class GeoMap extends React.Component {
  render() {
    const { jobsList } = this.props;
    const jobMarkers = jobsList.map(job => (
      <JobMarker key={job._id} job={job} />
    ));
    return jobsList && jobsList.length > 0 ? (
      <MyMapComponent isMarkerShown={true} markers={jobMarkers} />
    ) : null;
  }
}

export default GeoMap;

class JobMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    autoBind(this, 'toggleShow');
  }
  toggleShow() {
    this.setState({ show: !this.state.show });
  }
  render() {
    const { job } = this.props;

    return (
      <Marker
        position={{
          lng: job.location.coordinates[0],
          lat: job.location.coordinates[1]
        }}
        onClick={this.toggleShow}
      >
        {this.state.show && (
          <InfoBox
            onCloseClick={this.toggleShow}
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
                {job.title}
              </div>
            </div>
          </InfoBox>
        )}
      </Marker>
    );
  }
}
