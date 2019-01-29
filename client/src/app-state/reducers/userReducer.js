import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  userDetails: {
    rating: {},
    userId: '',
    _id: '',
    displayName: 'Join Us for Free',
    email: {},
    profileImage: {
      url: 'https://static.thenounproject.com/png/630729-200.png',
    },
  },
  myStripeAccBalanceDetails: { balanceDetails: {}, basicDetails: {} },
  isLoadingStripeAccountDetails: false,
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

const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE}`]: updateUserProfile,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${
      A._PENDING
    }`]: updateUserStripeAccountDetails.pending,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${
      A._FULFILLED
    }`]: updateUserStripeAccountDetails.fulfilled,
    [`${A.USER_MODEL_ACTIONS.GET_MY_STRIPE_ACCOUNT_DETAILS}${
      A._REJECTED
    }`]: updateUserStripeAccountDetails.rejected,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: setLoggedInState,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
  },
  initialState,
);
