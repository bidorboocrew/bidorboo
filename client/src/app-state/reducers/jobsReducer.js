import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';

const initialState = {
  allMyRequests: [],
  myOpenJobsList: [],
  myAwardedJobsList: [],
  listOfJobsToBidOn: [],
  error: null,
  isLoading: false,
  mapCenterPoint: { lat: 45.4215, lng: -75.6972 },
  // the currently selected active job
  selectedJobWithBids: {},
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

const getAllMyRequests = {
  isPending: (state = initialState) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let allMyRequests = payload.data.allRequests;
    return { ...state, allMyRequests, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllMyRequestsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_MY_REQUESTS}${A._REJECTED}`;
    return { ...state, error: getAllMyRequestsError, isLoading: false };
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
      listOfJobsToBidOn: allThePostedJobs,
      isLoading: false,
    };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllJobsToBidOnError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`;
    return { ...state, error: getAllJobsToBidOnError, isLoading: false };
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
    return { ...state, listOfJobsToBidOn: searchResult, isLoading: false };
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
    selectedJobWithBids: payload.data,
  };
};
const updateSelectedJobToBidOn = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedJobWithBids: payload.data,
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
        selectedJobWithBids: {},
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

const markBidAsSeen = (state = initialState, { payload }) => {
  const { jobId, bidId } = payload;

  if (jobId && bidId) {
    const updatedMyOpenJobsList = state.myOpenJobsList.map((job) => {
      if (job._id === jobId) {
        const updated_bidsListRef =
          job._bidsListRef &&
          job._bidsListRef.map((bid) => {
            if (bid._id === bidId) {
              return { ...bid, isNewBid: false };
            } else {
              return { ...bid };
            }
          });
        return { ...job, _bidsListRef: updated_bidsListRef };
      } else {
        return { ...job };
      }
    });

    const updateBidStateForCurrentActiveJob =
      state.selectedJobWithBids._bidsListRef &&
      state.selectedJobWithBids._bidsListRef.map((bid) => {
        if (bid._id === bidId) {
          return { ...bid, isNewBid: false };
        } else {
          return { ...bid };
        }
      });

    const updatedSelectedActivePostedJob = {
      ...state.selectedJobWithBids,
      _bidsListRef: updateBidStateForCurrentActiveJob,
    };

    return {
      ...state,
      myOpenJobsList: [...updatedMyOpenJobsList],
      selectedJobWithBids: { ...updatedSelectedActivePostedJob },
    };
  }
};
const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    // everything
    [`${A.JOB_ACTIONS.GET_ALL_MY_REQUESTS}${A._PENDING}`]: getAllMyRequests.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_REQUESTS}${A._FULFILLED}`]: getAllMyRequests.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_REQUESTS}${A._REJECTED}`]: getAllMyRequests.isRejected,
    // open jobs
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._PENDING}`]: getMyOpenJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._FULFILLED}`]: getMyOpenJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS}${A._REJECTED}`]: getMyOpenJobs.isRejected,
    // awarded jobs
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._PENDING}`]: getMyAwardedJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._FULFILLED}`]: getMyAwardedJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS}${A._REJECTED}`]: getMyAwardedJobs.isRejected,
    // search jobs
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS_VIA_SEARCH}${A._PENDING}`]: getPostedJobs.isPending,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS_VIA_SEARCH}${A._FULFILLED}`]: getPostedJobs.isFullfilled,
    [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS_VIA_SEARCH}${A._REJECTED}`]: getPostedJobs.isRejected,
    //delete a job
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._PENDING}`]: deleteJob.isPending,
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._FULFILLED}`]: deleteJob.isFullfilled,
    [`${A.JOB_ACTIONS.DELETE_JOB_BY_ID}${A._REJECTED}`]: deleteJob.isRejected,

    // [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._PENDING}`]: getPostedJobs.isPending,
    // [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._FULFILLED}`]: getPostedJobs.isFullfilled,
    // [`${A.JOB_ACTIONS.GET_ALL_POSTED_JOBS}${A._REJECTED}`]: getPostedJobs.isRejected,
    [`${A.JOB_ACTIONS.SEARCH_JOB}`]: searchJob.performSearch,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._PENDING}`]: searchJob.isPending,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._FULFILLED}`]: searchJob.isFullfilled,
    [`${A.JOB_ACTIONS.SEARCH_JOB}${A._REJECTED}`]: searchJob.isRejected,
    [`${A.JOB_ACTIONS.SELECT_ACTIVE_POSTED_JOB}`]: updateSelectedActivePostedJob,
    [`${A.JOB_ACTIONS.SELECT_AWARDED_JOB}`]: updateSelectedAwardedJob,
    [`${A.JOB_ACTIONS.MARK_BID_AS_SEEN}`]: markBidAsSeen,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
  },
  initialState,
);
