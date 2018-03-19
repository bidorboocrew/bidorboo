import * as A from '../actionTypes';

const initialState = {
  userJobsList: [],
  error: null,
  isLoading: false
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case `${A.JOB_ACTIONS.GET_ALL_JOBS}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.GET_ALL_JOBS}${A._FULFILLED}`:
      return { ...state, userJobsList: payload.data, isLoading: false };
    case `${A.JOB_ACTIONS.GET_ALL_JOBS}${A._REJECTED}`:
      return { ...state, error: payload.data, isLoading: false };
    default:
      return state;
  }
}
