import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  verifyingPhone: false,
  verifyingEmail: false,
  isLoggedIn: false,
  isFetchingNotificationSettings: true,
  userDetails: {
    notifications: {
      push: false,
      email: false,
      text: false,
    },
    rating: 0,
    userId: '',
    _id: 'loggedOutUser_uuid', // do not change this
    displayName: 'You',
    email: '',
    profileImage: {
      url: '',
    },
  },
  myStripeAccBalanceDetails: { balanceDetails: {}, basicDetails: {} },
  isLoadingStripeAccountDetails: false,
  isLoadingAnotherUserProfile: false,
  otherUserProfileInfo: {},
};
const updateUserProfile = (state = initialState, { payload }) => {
  return {
    ...state,
    userDetails: payload,
    isLoggedIn: true,
  };
};

const setLoggedInState = (state = initialState) => ({
  ...state,
  isLoggedIn: true,
});

const updateUserStripeAccountDetails = {
  pending: (state = initialState, { payload }) => {
    return {
      ...state,
      myStripeAccountDetails: {},
      isLoadingStripeAccountDetails: true,
    };
  },
  rejected: (state = initialState, { payload }) => {
    return {
      ...state,
      myStripeAccountDetails: {},
      isLoadingStripeAccountDetails: false,
    };
  },
  fulfilled: (state = initialState, { payload }) => {
    return {
      ...state,
      myStripeAccountDetails: payload.data,
      isLoadingStripeAccountDetails: false,
    };
  },
};

const getOtherUserProfileDetails = {
  pending: (state = initialState, { payload }) => {
    return {
      ...state,
      otherUserProfileInfo: {},
      isLoadingAnotherUserProfile: true,
    };
  },
  rejected: (state = initialState, { payload }) => {
    return {
      ...state,
      otherUserProfileInfo: {},
      isLoadingAnotherUserProfile: false,
    };
  },
  fulfilled: (state = initialState, { payload }) => {
    return {
      ...state,
      otherUserProfileInfo: payload ? payload.data : {},
      isLoadingAnotherUserProfile: false,
    };
  },
};


const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${A._PENDING}`]: updateUserStripeAccountDetails.pending,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${A._FULFILLED}`]: updateUserStripeAccountDetails.fulfilled,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${A._REJECTED}`]: updateUserStripeAccountDetails.rejected,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: setLoggedInState,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,

    [`${A.USER_MODEL_ACTIONS.GET_OTHER_USER_PROFILE_INFO}${A._REJECTED}`]: getOtherUserProfileDetails.rejected,

    [`${A.USER_MODEL_ACTIONS.GET_OTHER_USER_PROFILE_INFO}${A._PENDING}`]: getOtherUserProfileDetails.pending,

    [`${A.USER_MODEL_ACTIONS.GET_OTHER_USER_PROFILE_INFO}${A._FULFILLED}`]: getOtherUserProfileDetails.fulfilled,

    [`${A.AUTH_ACTIONS.VERIFY_USER_EMAIL}${A._PENDING}`]: (state = initialState) => ({
      ...state,
      verifyingEmail: true,
    }),
    [`${A.AUTH_ACTIONS.VERIFY_USER_PHONE}${A._PENDING}`]: (state = initialState) => ({
      ...state,
      verifyingPhone: true,
    }),

    [`${A.AUTH_ACTIONS.VERIFY_USER_EMAIL}${A._REJECTED}`]: (state = initialState) => ({
      ...state,
      verifyingEmail: false,
    }),
    [`${A.AUTH_ACTIONS.VERIFY_USER_PHONE}${A._REJECTED}`]: (state = initialState) => ({
      ...state,
      verifyingPhone: false,
    }),
  },
  initialState,
);
