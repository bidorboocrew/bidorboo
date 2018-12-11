import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  userDetails: {
    rating: {},
    userId: '',
    displayName: 'Join Us for Free',
    email: {},
    profileImage: {
      url: 'https://goo.gl/92gqPL',
    },
  },
  userUnderReviewDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: {},
    profileImage: {
      url: 'https://goo.gl/92gqPL',
    },
  },
};
const updateUserProfile = (state = initialState, { payload }) => {
  debugger;
  return {
    ...state,
    userDetails: payload,
  };
};

const updateUserUnderReviewDetails = (state = initialState, { payload }) => ({
  ...state,
  userUnderReviewDetails: payload,
});

const setLoggedInState = (state = initialState) => ({
  ...state,
  isLoggedIn: true,
});
const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_UNDER_REVIEW_DETAILS}`]: updateUserUnderReviewDetails,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: setLoggedInState,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
  },
  initialState,
);
