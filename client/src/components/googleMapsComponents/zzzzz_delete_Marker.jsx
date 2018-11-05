// import React from 'react';

// import { Marker } from 'react-google-maps';

// export default class JobMarker extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { show: false };
//     autoBind(this, 'toggleShow');
//   }
//   toggleShow() {
//     this.setState({ show: !this.state.show });
//   }
//   render() {
//     const { job } = this.props;

//     return (
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
//                 backgroundColor: `white`,
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
//     );
//   }
// }
