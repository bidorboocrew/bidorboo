import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  userDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: '',
    profileImage: {
      url: 'https://goo.gl/92gqPL',
    },
  },
  userUnderReviewDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: '',
    profileImage: {
      url: 'https://goo.gl/92gqPL',
    },
  },
};
const updateUserProfile = (state = initialState, { payload }) => ({
  ...state,
  userDetails: payload,
});

const updateUserUnderReviewDetails = (state = initialState, { payload }) => ({
  ...state,
  userUnderReviewDetails: payload,
});

export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_UNDER_REVIEW_DETAILS}`]: updateUserUnderReviewDetails,
  },
  initialState
);
