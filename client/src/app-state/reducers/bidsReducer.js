import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  // the job that the user is currently looking to bid on
  jobDetails: {},
  openBidsList: [],
  isLoadingBids: false,
  getBidsErrorMsg: '',
  selectedOpenBid: {},

  awardedBidsList: [],
  selectedAwardedBid: {},
};

const selectJobToBidOn = (state = initialState, { payload }) => ({
  ...state,
  jobDetails: payload.jobDetails,
});

const getMyOpenBids = {
  isPending: (state = initialState) => ({
    ...state,
    isLoadingBids: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload) {
      const bids = payload && payload.data;
      const { _postedBidsRef } = bids;
      return {
        ...state,
        isLoadingBids: false,
        openBidsList: _postedBidsRef || [],
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      openBidsList: [],
      getBidsErrorMsg: getBidsErrorMsg,
    };
  },
};

const getOpenBidDetails = {
  isPending: (state = initialState) => ({
    ...state,
    selectedOpenBid: {},
    isLoadingBids: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload) {
      const bid = payload && payload.data;

      return {
        ...state,
        isLoadingBids: false,
        selectedOpenBid: bid,
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      selectedOpenBid: {},
      getBidsErrorMsg: getBidsErrorMsg,
    };
  },
};

const getMyAwardedBids = {
  isPending: (state = initialState) => ({
    ...state,
    awardedBidsList: [],
    isLoadingBids: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload) {
      const bids = payload && payload.data;
      const { _postedBidsRef } = bids;
      return {
        ...state,
        isLoadingBids: false,
        awardedBidsList: _postedBidsRef || [],
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      awardedBidsList: [],
      getBidsErrorMsg: getBidsErrorMsg,
    };
  },
};
const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON}`]: selectJobToBidOn,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._PENDING}`]: getMyOpenBids.isPending,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._FULFILLED}`]: getMyOpenBids.isFullfilled,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._REJECTED}`]: getMyOpenBids.isRejected,
    // get open bid details
    [`${A.BIDDER_ACTIONS.GET_OPEN_BID_DETAILS}${A._PENDING}`]: getOpenBidDetails.isPending,
    [`${A.BIDDER_ACTIONS.GET_OPEN_BID_DETAILS}${A._FULFILLED}`]: getOpenBidDetails.isFullfilled,
    [`${A.BIDDER_ACTIONS.GET_OPEN_BID_DETAILS}${A._REJECTED}`]: getOpenBidDetails.isRejected,
    // get awarded bids
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_AWARDED_BIDS}${A._PENDING}`]: getMyAwardedBids.isPending,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_AWARDED_BIDS}${A._FULFILLED}`]: getMyAwardedBids.isFullfilled,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_AWARDED_BIDS}${A._REJECTED}`]: getMyAwardedBids.isRejected,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
  },
  initialState,
);
