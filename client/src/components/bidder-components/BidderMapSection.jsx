import React from 'react';
import MapWithAMarkerClusterer from '../googleMapsComponents/MapWithAMarkerClusterer';

export default class BidderMapSection extends React.Component {
  render() {
    const {
      jobsList,
      mapCenterPoint,
      selectJobToBidOn,
      currentUserId,
      isLoggedIn,
      showLoginDialog,
    } = this.props;
    return jobsList && jobsList.length > 0 ? (
      <MapWithAMarkerClusterer
        selectJobToBidOn={selectJobToBidOn}
        mapCenterPoint={mapCenterPoint}
        markers={jobsList}
        currentUserId={currentUserId}
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
      />
    ) : null;
  }
}

// import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';
// import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
// https://tomchentw.github.io/react-google-maps/#infobox
// const MyMapComponent = compose(
//   withProps({
//     googleMapURL:
//       'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0th06BSi2RQMJH8_kCsSdBfMRW4MbrjU&v=3.exp&libraries=geometry,drawing,places',
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: `400px` }} />,
//     mapElement: <div style={{ height: `100%` }} />
//   }),
//   // withScriptjs,
//   withGoogleMap
// )(props => (
//   <GoogleMap defaultZoom={8} defaultCenter={{ lat: 45.4215, lng: -75.6972 }}>
//     {props.isMarkerShown && <React.Fragment>{props.markers}</React.Fragment>}
//   </GoogleMap>
// ));

// class JobMarker extends React.Component {
//   constructor(props) {
//     //debugger;
//     super(props);
//     this.state = { show: false };
//     autoBind(this, 'toggleShow', 'onMarkerClustererClick');
//   }
//   toggleShow() {
//     this.setState({ show: !this.state.show });
//   }
//   onMarkerClustererClick(markerClusterer) {
//     const clickedMarkers = markerClusterer.getMarkers();
//     console.log(`Current clicked markers length: ${clickedMarkers.length}`);
//     console.log(clickedMarkers);
//   }

//   render() {
//     //debugger;
//     const { jobsList } = this.props;
//     const markersList = jobsList.map(job => (
//       <Marker
//         position={{
//           lng: job.location.coordinates[0],
//           lat: job.location.coordinates[1]
//         }}
//         onClick={this.toggleShow}
//       >
//         {this.state.show && (
//           <InfoBox
//             onCloseClick={this.toggleShow}
//             options={{ closeBoxURL: ``, enableEventPropagation: true }}
//           >
//             <div
//               style={{
//                 backgroundColor: `whitesmoke`,
//                 border: '1px solid rgba(0, 0, 0, 0.12)',
//                 // opacity: 0.8,
//                 padding: `12px`
//               }}
//             >
//               <div style={{ fontSize: `16px`, fontColor: `#4a4a4a` }}>
//                 {job.title}
//               </div>
//             </div>
//           </InfoBox>
//         )}
//       </Marker>
//     ));

//     return (
//       <MarkerClusterer
//         onClick={this.onMarkerClustererClick}
//         averageCenter
//         enableRetinaIcons
//         gridSize={60}
//       >
//         {markersList}
//       </MarkerClusterer>
//     );
//   }
// }
