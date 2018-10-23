import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';

const initialState = {
  myPostedJobsList: [],
  allThePostedJobsList: [],
  error: null,
  isLoading: false,
  mapCenterPoint: { lat: 45.4215, lng: -75.6972 },
  // the currently selected active job
  selectedActiveJob: {},
  // the currently selected awarded job
  selectedAwardedJob: {},
};

const getMyJobs = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let myPostedJobs =
      payload.data && payload.data._postedJobsRef ? payload.data._postedJobsRef : [];
    return { ...state, myPostedJobsList: myPostedJobs, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllMyJobsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`;
    return { ...state, error: getAllMyJobsError, isLoading: false };
  },
};

const getPostedJobs = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let allThePostedJobs = payload.data ? payload.data : [];
    return {
      ...state,
      allThePostedJobsList: allThePostedJobs,
      isLoading: false,
    };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllPostedJobsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`;
    return { ...state, error: getAllPostedJobsError, isLoading: false };
  },
};

const searchJob = {
  performSearch: (state = initialState, { payload }) => ({
    ...state,
    mapCenterPoint: payload.searchLocation,
  }),
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let searchResult = payload && payload.data ? payload.data : [];
    return { ...state, allThePostedJobsList: searchResult, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const searchJobsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`;
    return { ...state, error: searchJobsError, isLoading: false };
  },
};

const updateSelectedActiveJob = (state = initialState, { payload }) => ({
  ...state,
  selectedActiveJob: payload.data,
});

const updateSelectedAwardedJob = (state = initialState, { payload }) => ({
  ...state,
  selectedAwardedJob: payload.data,
});

export default handleActions(
  {
    [`${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._PENDING}`]: getMyJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._FULFILLED}`]: getMyJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`]: getMyJobs.isRejected,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._PENDING}`]: getPostedJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._FULFILLED}`]: getPostedJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`]: getPostedJobs.isRejected,
    [`${A.JOB_ACTIONS.SEARCH_JOB}`]: searchJob.performSearch,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._PENDING}`]: searchJob.isPending,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._FULFILLED}`]: searchJob.isFullfilled,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`]: searchJob.isRejected,
    [`${A.JOB_ACTIONS.SELECT_ACTIVE_JOB}`]: updateSelectedActiveJob,
    [`${A.JOB_ACTIONS.SELECT_AWARDED_JOB}`]: updateSelectedAwardedJob,
  },
  initialState
);
