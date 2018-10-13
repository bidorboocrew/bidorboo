// import PropTypes from 'prop-types';

// /**
//  * to define the client-server interfaces for objects
//  */

// export const Proptypes_startingDateAndTimeModel = PropTypes.shape({
//   _id: PropTypes.string,
//   date: PropTypes.date,
//   hours: PropTypes.number,
//   minutes: PropTypes.number,
//   period: PropTypes.oneOf(['AM', 'PM'])
// });

// export const Proptypes_bidAmountModel = PropTypes.shape({
//   currency: PropTypes.string,
//   value: PropTypes.number
// });

// export const Proptypes_jobModel = PropTypes.shape({
//   _id: PropTypes.string,
//   _bidsListRef: PropTypes.arrayOf(PropTypes.shape(Proptypes_bidModel)),
//   whoSeenThis: PropTypes.arrayOf(PropTypes.string),
//   detailedDescription: PropTypes.string,
//   location: PropTypes.shape({
//     type: PropTypes.oneOf(['Point']),
//     coordinates: PropTypes.arrayOf(PropTypes.number)
//   }),
//   startingDateAndTime: Proptypes_startingDateAndTimeModel,
//   addressText: PropTypes.string,
//   state: PropTypes.string,
//   title: PropTypes.string,
//   fromTemplateId: PropTypes.string,
//   _ownerRef: PropTypes.shape({
//     _id: PropTypes.string,
//     postedJobs: PropTypes.array,
//     _postedBidsRef: PropTypes.array,
//     globalRating: PropTypes.string,
//     profileImage: PropTypes.shape({
//       url: PropTypes.string.isRequired,
//       public_id: PropTypes.string
//     }),
//     userRole: PropTypes.string,
//     hasAgreedToServiceTerms: PropTypes.bool,
//     verified: PropTypes.bool,
//     bidCancellations: PropTypes.number,
//     canBid: PropTypes.bool,
//     canPost: PropTypes.bool,
//     displayName: PropTypes.string,
//     userId: PropTypes.string,
//     email: PropTypes.string,
//     membershipStatus: PropTypes.string,
//     _reviewsRef: PropTypes.array,
//     creditCards: PropTypes.array,
//     createdAt: PropTypes.date,
//     updatedAt: PropTypes.date
//   }),
//   properties: PropTypes.array,
//   createdAt: PropTypes.date,
//   updatedAt: PropTypes.date
// });

// export const Proptypes_bidModel = PropTypes.shape({
//   _bidderRef: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     _reviewsRef: PropTypes.arrayOf(PropTypes.any).isRequired,
//     displayName: PropTypes.string.isRequired,
//     globalRating: PropTypes.any,
//   }).isRequired,
//   _id: PropTypes.string.isRequired,
//   _jobRef: PropTypes.string.isRequired,
//   bidAmount: PropTypes.shape({
//     currency: PropTypes.string.isRequired,
//     value: PropTypes.number.isRequired,
//   }).isRequired,
//   createdAt: PropTypes.string.isRequired,
//   isNewBid: PropTypes.bool.isRequired,
//   state: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string.isRequired,
// }).isRequired;

// export const Proptypes_userModel = PropTypes.shape({
//   _id: PropTypes.string,
//   postedJobs: PropTypes.array,
//   _postedBidsRef: PropTypes.array,
//   globalRating: PropTypes.string,
//   profileImage: PropTypes.shape({
//     url: PropTypes.string.isRequired,
//     public_id: PropTypes.string
//   }),
//   userRole: PropTypes.string,
//   hasAgreedToServiceTerms: PropTypes.bool,
//   verified: PropTypes.bool,
//   bidCancellations: PropTypes.number,
//   canBid: PropTypes.bool,
//   canPost: PropTypes.bool,
//   displayName: PropTypes.string,
//   userId: PropTypes.string,
//   email: PropTypes.string,
//   membershipStatus: PropTypes.string,
//   _reviewsRef: PropTypes.array,
//   creditCards: PropTypes.array,
//   createdAt: PropTypes.date,
//   updatedAt: PropTypes.date
// });
