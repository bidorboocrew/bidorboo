//will host all UI global changes
import * as A from '../actionTypes';

const initialState = {
  // the job that the user is currently looking to bid on
  jobDetails: {}
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.BIDDER_ACTIONS.SELECT_JOB_TO_BID_ON:
      return {
        ...state,
        jobDetails: payload.jobDetails
      };
    default:
      return state;
  }
}
