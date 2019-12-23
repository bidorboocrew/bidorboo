import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';
import uuidv1 from 'uuid/v1';

const initialState = {
  specialMomentContent: null,
  authIsInProgress: true,
  shouldShowLoginDialog: false,
  userAppView: 'REQUESTER', //or TASKER
  /**
   * toastDetails : {toastType : warning|successful|error , Msg: string, toastId: uuid}
   */
  toastDetails: {},
  notificationFeed: {},
  paymentIsInProgress: false,
};

const closeLoginDialog = (state = initialState) => ({
  ...state,
  shouldShowLoginDialog: false,
});
const openLoginDialog = (state = initialState) => ({
  ...state,
  shouldShowLoginDialog: true,
});
const showToastNotification = (state = initialState, { payload }) => ({
  ...state,
  toastDetails: { ...payload.toastDetails, toastId: uuidv1() },
});
const showSpecialMoment = (state = initialState, { payload }) => {
  return {
    ...state,
    specialMomentContent: payload.specialMomentContent || null,
  };
};
const updateNotificationFeed = (state = initialState, { payload }) => {
  if (payload) {
    const requestIdsWithNewBids = payload.z_notify_requestsWithNewUnseenState || [];
    const myBidsWithNewStatus = payload.z_notify_myBidsWithNewStatus || [];
    const reviewsToBeFilled = payload.z_track_reviewsToBeFilled || [];
    const workTodo = payload.z_track_workToDo || [];
    const requestsHappeningToday = payload.z_requestsHappeningToday || [];
    const bidsHappeningToday = payload.z_bidsHappeningToday || [];

    return {
      ...state,
      notificationFeed: {
        requestIdsWithNewBids,
        myBidsWithNewStatus,
        reviewsToBeFilled,
        workTodo,
        requestsHappeningToday,
        bidsHappeningToday,
      },
    };
  }
};
const setLoggedOutState = () => {
  return { ...initialState };
};
export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS}`]: updateNotificationFeed,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.OPEN_LOGIN_DIALOG}`]: openLoginDialog,
    [`${A.UI_ACTIONS.CLOSE_LOGIN_DIALOG}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.SHOW_TOAST_MSG}`]: showToastNotification,
    [`${A.UI_ACTIONS.SHOW_SPECIAL_MOMENT}`]: showSpecialMoment,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,

    [`${A.UI_ACTIONS.SET_APP_TASKER_VIEW}`]: (state = initialState) => {
      return { ...state, userAppView: 'TASKER' };
    },
    [`${A.UI_ACTIONS.SET_APP_REQUESTER_VIEW}`]: (state = initialState) => {
      return { ...state, userAppView: 'REQUESTER' };
    },
    [`${A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED}${A._PENDING}`]: (state = initialState) => {
      return { ...state, authIsInProgress: true };
    },
    [`${A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED}${A._FULFILLED}`]: (state = initialState) => {
      return { ...state, authIsInProgress: false };
    },
    [`${A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED}${A._REJECTED}`]: (state = initialState) => {
      return { ...state, authIsInProgress: false };
    },
    [`${A.REQUESTER_ACTIONS.AWARD_TASKER_AND_MAKE_A_PAYMENT}${A._PENDING}`]: (
      state = initialState,
    ) => {
      return { ...state, paymentIsInProgress: true };
    },
    [`${A.REQUESTER_ACTIONS.AWARD_TASKER_AND_MAKE_A_PAYMENT}${A._FULFILLED}`]: (
      state = initialState,
    ) => {
      return { ...state, paymentIsInProgress: false };
    },
    [`${A.REQUESTER_ACTIONS.AWARD_TASKER_AND_MAKE_A_PAYMENT}${A._REJECTED}`]: (
      state = initialState,
    ) => {
      return { ...state, paymentIsInProgress: false };
    },
  },
  initialState,
);
