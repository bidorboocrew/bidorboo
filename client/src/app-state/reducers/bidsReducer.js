import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  // the job that the user is currently looking to bid on
  jobDetails: {},
  bidsList: [],
  isLoadingBids: false,
  getBidsErrorMsg: '',
  recentlyUpdatedBid: {}
};

const selectJobToBidOn = (state = initialState, { payload }) => ({
  ...state,
  jobDetails: payload.jobDetails
});

const updateRecentBid = (state = initialState, { payload }) => ({
  ...state,
  recentlyUpdatedBid: payload.data
});

const getAllMyBids = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoadingBids: true
  }),
  isFullfilled: (state = initialState, { payload }) => {
    const userModel = payload && payload.data;
    const { _postedBids } = userModel;
    return {
      ...state,
      isLoadingBids: false,
      bidsList: _postedBids || []
    };
  },
  isRejected: (state = initialState, { payload }) => {
    const getBidsErrorMsg =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
    return {
      ...state,
      isLoadingBids: false,
      bidsList: [],
      getBidsErrorMsg: getBidsErrorMsg
    };
  }
};

export default handleActions(
  {
    [`${A.BIDDER_ACTIONS.UPDATE_RECENTLY_ADDED_BIDS}`]: updateRecentBid,
    [`${A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON}`]: selectJobToBidOn,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._PENDING}`]: getAllMyBids.isPending,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._FULFILLED}`]: getAllMyBids.isFullfilled,
    [`${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._REJECTED}`]: getAllMyBids.isRejected
  },
  initialState
);
