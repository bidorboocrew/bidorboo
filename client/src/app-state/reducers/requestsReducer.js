import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';

const initialState = {
  myRequestsSummary: [],
  myAwardedRequestsList: [],
  listOfRequestsToBidOn: [],
  error: null,
  isLoading: false,
  mapCenterPoint: { lat: 45.4215, lng: -75.6972 },
  selectedRequestWithBids: {},
  selectedAwardedRequest: {},
  selectedArchivedRequest: {},
};

const getMyRequestsSummary = {
  isPending: (state = initialState) => ({
    ...state,
    isLoading: true,
    myRequestsSummary: [],
  }),
  isFullfilled: (state = initialState, { payload }) => {
    const myRequestsSummary =
      payload.data && payload.data.myRequestsSummary ? payload.data.myRequestsSummary : [];
    return { ...state, myRequestsSummary, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const getMyRequestsSummaryError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.GET_ALL_MY_REQUESTS}${A._REJECTED}`;
    return { ...state, error: getMyRequestsSummaryError, isLoading: false };
  },
};

const getPostedRequests = {
  isPending: (state = initialState) => ({
    ...state,
    isLoading: true,
    listOfRequestsToBidOn: [],
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let allThePostedRequests = payload && payload.data ? payload.data : [];

    return {
      ...state,
      listOfRequestsToBidOn: allThePostedRequests,
      isLoading: false,
    };
  },
  isRejected: (state = initialState, { payload }) => {
    const getAllRequestsToBidOnError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.GET_ALL_POSTED_REQUESTS}${A._REJECTED}`;
    return { ...state, error: getAllRequestsToBidOnError, isLoading: false };
  },
};

const searchRequest = {
  performSearch: (state = initialState, { payload }) => ({
    ...state,
    mapCenterPoint: payload.searchLocation,
    listOfRequestsToBidOn: [],
  }),
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    let searchResult = payload && payload.data ? payload.data : [];
    return { ...state, listOfRequestsToBidOn: searchResult, isLoading: false };
  },
  isRejected: (state = initialState, { payload }) => {
    const searchRequestsError =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._REJECTED}`;
    return { ...state, error: searchRequestsError, isLoading: false };
  },
};

const updateSelectedActivePostedRequest = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedRequestWithBids: payload.data,
  };
};
const updateSelectedArchivedRequest = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedArchivedRequest: payload.data,
  };
};
const updateSelectedAwardedRequest = (state = initialState, { payload }) => {
  return {
    ...state,
    selectedAwardedRequest: payload.data,
  };
};

const deleteRequest = {
  isPending: (state = initialState, { payload }) => ({
    ...state,
    isLoading: true,
  }),
  isFullfilled: (state = initialState, { payload }) => {
    if (payload && payload.data) {
      const deletedRequestId = payload.data;
      const filteredResults =
        state.myRequests &&
        state.myRequests.filter((request) => {
          return request._id !== deletedRequestId;
        });

      return {
        ...state,
        myRequests: filteredResults,
        selectedRequestWithBids: {},
        isLoading: false,
      };
    }
  },
  isRejected: (state = initialState, { payload }) => {
    const error =
      payload && payload.data
        ? payload.data
        : `unknown issue while ${A.REQUEST_ACTIONS.DELETE_REQUEST_BY_ID}${A._REJECTED}`;
    return { ...state, error, isLoading: false };
  },
};

const markBidAsSeen = (state = initialState, { payload }) => {
  const { requestId, bidId } = payload;
  if (requestId && bidId) {
    const updatedBidsList =
      state.selectedRequestWithBids._bidsListRef &&
      state.selectedRequestWithBids._bidsListRef.map((bid) => {
        if (bid._id === bidId) {
          return { ...bid, isNewBid: false };
        } else {
          return bid;
        }
      });
    const updatedSelectedActivePostedRequest = {
      ...state.selectedRequestWithBids,
      _bidsListRef: updatedBidsList,
    };
    return {
      ...state,
      selectedRequestWithBids: { ...updatedSelectedActivePostedRequest },
    };
  }
};
const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.REQUEST_ACTIONS.GET_ALL_POSTED_REQUESTS_VIA_SEARCH}${A._PENDING}`]: getPostedRequests.isPending,
    [`${A.REQUEST_ACTIONS.GET_ALL_POSTED_REQUESTS_VIA_SEARCH}${A._FULFILLED}`]: getPostedRequests.isFullfilled,
    [`${A.REQUEST_ACTIONS.GET_ALL_POSTED_REQUESTS_VIA_SEARCH}${A._REJECTED}`]: getPostedRequests.isRejected,

    [`${A.REQUEST_ACTIONS.DELETE_REQUEST_BY_ID}${A._PENDING}`]: deleteRequest.isPending,
    [`${A.REQUEST_ACTIONS.DELETE_REQUEST_BY_ID}${A._FULFILLED}`]: deleteRequest.isFullfilled,
    [`${A.REQUEST_ACTIONS.DELETE_REQUEST_BY_ID}${A._REJECTED}`]: deleteRequest.isRejected,

    [`${A.REQUEST_ACTIONS.SEARCH_REQUEST}`]: searchRequest.performSearch,
    [`${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._PENDING}`]: searchRequest.isPending,
    [`${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._FULFILLED}`]: searchRequest.isFullfilled,
    [`${A.REQUEST_ACTIONS.SEARCH_REQUEST}${A._REJECTED}`]: searchRequest.isRejected,
    [`${A.REQUEST_ACTIONS.SELECT_ACTIVE_POSTED_REQUEST}`]: updateSelectedActivePostedRequest,
    [`${A.REQUEST_ACTIONS.SELECT_ARCHIVE_REQUEST}`]: updateSelectedArchivedRequest,

    [`${A.REQUEST_ACTIONS.SELECT_AWARDED_REQUEST}`]: updateSelectedAwardedRequest,
    [`${A.REQUEST_ACTIONS.MARK_BID_AS_SEEN}`]: markBidAsSeen,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,

    [`${A.REQUEST_ACTIONS.GET_MY_REQUESTS_SUMMARY}${A._PENDING}`]: getMyRequestsSummary.isPending,
    [`${A.REQUEST_ACTIONS.GET_MY_REQUESTS_SUMMARY}${A._FULFILLED}`]: getMyRequestsSummary.isFullfilled,
    [`${A.REQUEST_ACTIONS.GET_MY_REQUESTS_SUMMARY}${A._REJECTED}`]: getMyRequestsSummary.isRejected,
  },
  initialState,
);
