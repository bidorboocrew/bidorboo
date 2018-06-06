//will host all UI global changes
import * as A from '../actionTypes';

const initialState = {
  // the job that the user is currently looking to bid on
  jobDetails: {},
  bidsList: [],
  isLoadingBids: false,
  getBidsErrorMsg: ''
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON:
      return {
        ...state,
        jobDetails: payload.jobDetails
      };
    case `${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._PENDING}`:
      return { ...state, isLoadingBids: true };

    case `${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._FULFILLED}`:
      // userModelPropTypes._postedBids
      const userModel = payload && payload.data;
      const { _postedBids } = userModel;
      return {
        ...state,
        isLoadingBids: false,
        bidsList: _postedBids || []
      };
    case `${A.BIDDER_ACTIONS.GET_ALL_MY_BIDS}${A._REJECTED}`:
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
    default:
      return state;
  }
}
