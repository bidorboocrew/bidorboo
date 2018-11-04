import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';

const initialState = {
  myOpenJobsList: [],
  myAwardedJobsList: [],
  allThePostedJobsList: [],
  error: null,
  isLoading: false,
  mapCenterPoint: { lat: 45.4215, lng: -75.6972 },
  // the currently selected active job
  selectedActivePostedJob: {},
  // the currently selected awarded job
  selectedAwardedJob: {},
};

const getMyOpenJobs = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let myOpenJobs = payload.data && payload.data._postedJobsRef ? payload.data._postedJobsRef : [];
    return { ...state, myOpenJobsList: myOpenJobs, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllMyOpenJobsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`;
    return { ...state, error: getAllMyOpenJobsError, isLoading: false };
  },
};

const getMyAwardedJobs = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let myAwardedJobs =
      payload.data && payload.data._postedJobsRef ? payload.data._postedJobsRef : [];
    return { ...state, myAwardedJobsList: myAwardedJobs, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const error =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_MY_JOBS}${A._REJECTED}`;
    return { ...state, error, isLoading: false };
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

const updateSelectedActivePostedJob = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedActivePostedJob: payload.data,
  };
};

const updateSelectedAwardedJob = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedAwardedJob: payload.data,
  };
};

const deleteJob = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload && payload.data) {
      const deletedJobId = payload.data;
      const filteredResults =
        state.myOpenJobsList &&
        state.myOpenJobsList.filter((job) => {
          return job._id !== deletedJobId;
        });
      return {
        ...state,
        myOpenJobsList: filteredResults,
        selectedActivePostedJob: {},
        selectedActivePostedJob:{},
        isLoading: false,
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const error =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._REJECTED}`;
    return { ...state, error, isLoading: false };
  },
};

export default handleActions(
  {
    // open jobs
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._PENDING}`]: getMyOpenJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._FULFILLED}`]: getMyOpenJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._REJECTED}`]: getMyOpenJobs.isRejected,
    // awarded jobs
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._PENDING}`]: getMyAwardedJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._FULFILLED}`]: getMyAwardedJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._REJECTED}`]: getMyAwardedJobs.isRejected,
    //delete a job
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._PENDING}`]: deleteJob.isPending,
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._FULFILLED}`]: deleteJob.isFullfilled,
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._REJECTED}`]: deleteJob.isRejected,

    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._PENDING}`]: getPostedJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._FULFILLED}`]: getPostedJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`]: getPostedJobs.isRejected,
    [`${A.JOB_ACTIONS.SEARCH_JOB}`]: searchJob.performSearch,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._PENDING}`]: searchJob.isPending,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._FULFILLED}`]: searchJob.isFullfilled,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`]: searchJob.isRejected,
    [`${A.JOB_ACTIONS.SELECT_ACTIVE_POSTED_JOB}`]: updateSelectedActivePostedJob,
    [`${A.JOB_ACTIONS.SELECT_AWARDED_JOB}`]: updateSelectedAwardedJob,
  },
  initialState
);
