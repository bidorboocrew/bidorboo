import * as A from '../actionTypes';

const initialState = {
  myPostedJobsList: [],
  allThePostedJobsList: [],
  error: null,
  isLoading: false
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._FULFILLED}`:
      let myPostedJobs = payload.data && payload.data._postedJobs ? payload.data._postedJobs : [];
      return { ...state, myPostedJobsList: myPostedJobs, isLoading: false };
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`:
      return { ...state, error: payload.data, isLoading: false };
// get all jobs available at bdb system
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._FULFILLED}`:
      let allThePostedJobs = payload.data ? payload.data : [];
      return { ...state, allThePostedJobsList: allThePostedJobs, isLoading: false };
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`:
      return { ...state, error: payload.data, isLoading: false };
    default:
      return state;
  }
}
