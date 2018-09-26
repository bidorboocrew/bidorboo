import PropTypes from 'prop-types';

/**
 * to define the client-server interfaces for objects
 */

export const Proptypes_startingDateAndTimeModel = PropTypes.shape({
  _id: PropTypes.string,
  date: PropTypes.date,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  period: PropTypes.oneOf(['AM', 'PM'])
});

export const Proptypes_bidAmountModel = PropTypes.shape({
  currency: PropTypes.string,
  value: PropTypes.number
});

export const Proptypes_jobModel = PropTypes.shape({
  _id: PropTypes.string,
  _bidsList: PropTypes.arrayOf(PropTypes.string),
  whoSeenThis: PropTypes.arrayOf(PropTypes.string),
  detailedDescription: PropTypes.string,
  location: PropTypes.shape({
    type: PropTypes.oneOf(['Point']),
    coordinates: PropTypes.arrayOf(PropTypes.number)
  }),
  startingDateAndTime: Proptypes_startingDateAndTimeModel,
  addressText: PropTypes.string,
  state: PropTypes.string,
  title: PropTypes.string,
  fromTemplateId: PropTypes.string,
  _ownerId: PropTypes.shape({
    _id: PropTypes.string,
    postedJobs: PropTypes.array,
    _postedBids: PropTypes.array,
    globalRating: PropTypes.string,
    profileImage: PropTypes.shape({
      url: PropTypes.string.isRequired,
      public_id: PropTypes.string
    }),
    userRole: PropTypes.string,
    hasAgreedToServiceTerms: PropTypes.bool,
    verified: PropTypes.bool,
    bidCancellations: PropTypes.number,
    canBid: PropTypes.bool,
    canPost: PropTypes.bool,
    displayName: PropTypes.string,
    userId: PropTypes.string,
    email: PropTypes.string,
    membershipStatus: PropTypes.string,
    _reviews: PropTypes.array,
    creditCards: PropTypes.array,
    createdAt: PropTypes.date,
    updatedAt: PropTypes.date
  }),
  properties: PropTypes.array,
  createdAt: PropTypes.date,
  updatedAt: PropTypes.date
});

export const Proptypes_bidModel = PropTypes.shape({
  _id: PropTypes.string,
  bidAmount: Proptypes_bidAmountModel,
  hasJobOwnerSeenThis: PropTypes.bool,
  _bidderId: PropTypes.string,
  _job: Proptypes_jobModel,
  state: PropTypes.string,
  createdAt: PropTypes.date,
  updatedAt: PropTypes.date
});

export const Proptypes_userModel = PropTypes.shape({
  _id: PropTypes.string,
  postedJobs: PropTypes.array,
  _postedBids: PropTypes.array,
  globalRating: PropTypes.string,
  profileImage: PropTypes.string,
  userRole: PropTypes.string,
  hasAgreedToServiceTerms: PropTypes.bool,
  verified: PropTypes.bool,
  bidCancellations: PropTypes.number,
  canBid: PropTypes.bool,
  canPost: PropTypes.bool,
  displayName: PropTypes.string,
  userId: PropTypes.string,
  email: PropTypes.string,
  membershipStatus: PropTypes.string,
  _reviews: PropTypes.array,
  creditCards: PropTypes.array,
  createdAt: PropTypes.date,
  updatedAt: PropTypes.date
});
