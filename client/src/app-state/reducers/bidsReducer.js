import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  requestToBidOnDetails: {},
  openBidsList: [],
  isLoadingBids: false,
  getBidsErrorMsg: '',
  selectedOpenBid: {},
  selectedAwardedBid: {},
  selectedArchivedBid: {},
};

const selectRequestToBidOn = (state = initialState, { payload }) => ({
  ...state,
  requestToBidOnDetails: payload.requestDetails,
});
const updateSelectedArchivedBid = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedArchivedBid: payload.data,
  };
};

const getMyPostedBidsSummary = {
  isPending: (state = initialState) => ({
    ...state,
    isLoadingBids: true,
    openBidsList: [],
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload) {
      const bids = payload && payload.data;
      const { postedBids } = bids;
      return {
        ...state,
        isLoadingBids: false,
        openBidsList: postedBids || [],
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._REJECTED}`;
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
        : `unknown issue while ${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      selectedOpenBid: {},
      getBidsErrorMsg: getBidsErrorMsg,
    };
  },
};

const getAwardedBidDetail = {
  isPending: (state = initialState) => ({
    ...state,
    selectedAwardedBid: {},
    isLoadingBids: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload) {
      const bid = payload && payload.data;
      return {
        ...state,
        isLoadingBids: false,
        selectedAwardedBid: bid,
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      selectedAwardedBid: {},
      getBidsErrorMsg: getBidsErrorMsg,
    };
  },
};

const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.TASKER_ACTIONS.SELECT_REQUEST_TO_BID_ON}`]: selectRequestToBidOn,
    [`${A.TASKER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._PENDING}`]: getMyPostedBidsSummary.isPending,
    [`${A.TASKER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._FULFILLED}`]: getMyPostedBidsSummary.isFullfilled,
    [`${A.TASKER_ACTIONS.GET_ALL_MY_OPEN_BIDS}${A._REJECTED}`]: getMyPostedBidsSummary.isRejected,
    // get open bid details
    [`${A.TASKER_ACTIONS.GET_OPEN_BID_DETAILS}${A._PENDING}`]: getOpenBidDetails.isPending,
    [`${A.TASKER_ACTIONS.GET_OPEN_BID_DETAILS}${A._FULFILLED}`]: getOpenBidDetails.isFullfilled,
    [`${A.TASKER_ACTIONS.GET_OPEN_BID_DETAILS}${A._REJECTED}`]: getOpenBidDetails.isRejected,

    // get awarded bid details
    [`${A.TASKER_ACTIONS.GET_AWARDED_BID_DETAILS}${A._PENDING}`]: getAwardedBidDetail.isPending,
    [`${A.TASKER_ACTIONS.GET_AWARDED_BID_DETAILS}${A._FULFILLED}`]: getAwardedBidDetail.isFullfilled,
    [`${A.TASKER_ACTIONS.GET_AWARDED_BID_DETAILS}${A._REJECTED}`]: getAwardedBidDetail.isRejected,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
    [`${A.TASKER_ACTIONS.SELECT_ARCHIVED_BID}`]: updateSelectedArchivedBid,

  },
  initialState,
);
