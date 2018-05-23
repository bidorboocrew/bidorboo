import * as A from '../actionTypes';

const initialState = {
  myPostedJobsList: [],
  allThePostedJobsList: [],
  error: null,
  isLoading: false,
  mapCenterPoint: { lat: 45.4215, lng: -75.6972 }
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._FULFILLED}`:
      let myPostedJobs =
        payload.data && payload.data._postedJobs
          ? payload.data._postedJobs
          : [];
      return { ...state, myPostedJobsList: myPostedJobs, isLoading: false };
    case `${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`:
      const getAllMyJobsError =
        payload && payload.data
          ? payload.data
          : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${
              A._REJECTED
            }`;
      return { ...state, error: getAllMyJobsError, isLoading: false };
    // get all jobs available at bdb system
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._FULFILLED}`:
      let allThePostedJobs = payload.data ? payload.data : [];
      return {
        ...state,
        allThePostedJobsList: allThePostedJobs,
        isLoading: false
      };
    case `${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`:
      const getAllPostedJobsError =
        payload && payload.data
          ? payload.data
          : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${
              A._REJECTED
            }`;
      return { ...state, error: getAllPostedJobsError, isLoading: false };
    // search jobs
    case `${A.JOB_ACTIONS.SEARCH_JOB}`:
      return { ...state, mapCenterPoint: payload.searchLocation };
    case `${A.JOB_ACTIONS.SEARCH_JOB}${A._PENDING}`:
      return { ...state, isLoading: true };
    case `${A.JOB_ACTIONS.SEARCH_JOB}${A._FULFILLED}`:
      let searchResult = payload && payload.data ? payload.data : [];
      return { ...state, allThePostedJobsList: searchResult, isLoading: false };
    case `${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`:
      const searchJobsError =
        payload && payload.data
          ? payload.data
          : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
      return { ...state, error: searchJobsError, isLoading: false };
    default:
      return state;
  }
}
