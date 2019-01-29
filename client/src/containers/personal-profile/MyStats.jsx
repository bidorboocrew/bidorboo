// import React from 'react';
// import ReactStars from 'react-stars';

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import TextareaAutosize from 'react-autosize-textarea';
// import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
// import * as C from '../../constants/enumConstants';
// import ProfileForm from '../../components/forms/ProfileForm';
// import axios from 'axios';
// import PaymentSetupForm from '../../components/forms/PaymentSetupForm';
// import FileUploaderComponent from '../../components/FileUploaderComponent';
// import * as ROUTES from '../../constants/frontend-route-consts';
// import { getCurrentUser } from '../../app-state/actions/authActions';
// import {
//   XYPlot,
//   YAxis,
//   XAxis,
//   VerticalBarSeries,
//   VerticalGridLines,
//   HorizontalGridLines,
// } from 'react-vis';

// class MyStats extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const { userDetails, isLoggedIn, a_getCurrentUser } = this.props;

//     if (!isLoggedIn) {
//       return null;
//     }

//     let {
//       profileImage,
//       displayName,
//       email,
//       personalParagraph,
//       membershipStatus,
//       phone,
//       rating,
//     } = userDetails;

//     personalParagraph = personalParagraph || 'not provided';

//     const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
//     const data = [
//       { x: 0, y: 8 },
//       { x: 1, y: 5 },
//       { x: 2, y: 4 },
//       { x: 3, y: 9 },
//       { x: 4, y: 1 },
//       { x: 5, y: 7 },
//       { x: 6, y: 6 },
//       { x: 7, y: 3 },
//       { x: 8, y: 2 },
//       { x: 9, y: 0 },
//     ];
//     return (
//       <div className="container is-widescreen bidorbooContainerMargins">
//         <div className="columns is-centered is-gapless">
//           <div className="column">
//             <section style={{ backgroundColor: 'white', padding: '0.25rem' }}>
//               <HeaderTitle title="My Earnings last month" />
//               <div> * this is fake data for now</div>
//               <XYPlot height={300} width={500}>
//                 <VerticalGridLines />
//                 <HorizontalGridLines />
//                 <XAxis />
//                 <YAxis />
//                 <VerticalBarSeries data={data} />
//               </XYPlot>
//             </section>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToProps = ({ userReducer }) => {
//   return {
//     userDetails: userReducer.userDetails,
//     isLoggedIn: userReducer.isLoggedIn,
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
//     a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
//     a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(MyStats);

// const HeaderTitle = (props) => {
//   const { title, specialMarginVal } = props;
//   return (
//     <h2
//       style={{
//         marginTop: specialMarginVal || 0,
//         marginBottom: 4,
//         fontSize: 20,
//         borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
//       }}
//     >
//       {title}
//     </h2>
//   );
// };

// const userImageAndStats = (profileImage, membershipStatusDisplay, rating, displayName) => {
//   const { globalRating } = rating;
//   return (
//     <div style={{ padding: '0.25rem', height: '100%' }} className="has-text-dark">
//       <div>
//         <div>
//           <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
//         </div>
//       </div>

//       <div className="field">
//         <label className="label">Name</label>
//         <div className="control">
//           <div className="control">{displayName}</div>
//         </div>
//       </div>
//       <div className="field">
//         <label className="label">Rating</label>
//         {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
//           <p className="is-size-7">No Ratings Yet</p>
//         ) : (
//           <div className="control">
//             <span>
//               <ReactStars
//                 half
//                 count={5}
//                 value={globalRating}
//                 edit={false}
//                 size={25}
//                 color1={'lightgrey'}
//                 color2={'#ffd700'}
//               />
//             </span>
//             <span style={{ color: 'black' }} className="has-text-weight-semibold">
//               ({globalRating})
//             </span>
//           </div>
//         )}
//       </div>
//       <div className="field">
//         <label className="label">Status</label>
//         <div className="control">
//           <div className="control">{membershipStatusDisplay}</div>
//         </div>
//       </div>
//     </div>
//   );
// };
