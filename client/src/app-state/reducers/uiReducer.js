import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';
import uuidv1 from 'uuid/v1';

const initialState = {
  shouldShowLoginDialog: false,
  /**
   * toastDetails : {toastType : warning|successful|error , Msg: string, toastId: uuid}
   */
  toastDetails: {},
  notificationFeed: {},
  // applicationMode: C.APP_MODE.BIDDER
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

const updateNotificationFeed = (state = initialState, { payload }) => {
  if (payload) {
    // const
    const jobIdsWithNewBids = payload.z_notify_jobsWithNewBids || [];
    const myBidsWithNewStatus = payload.z_notify_myBidsWithNewStatus || [];
    const reviewsToBeFilled = payload.z_track_reviewsToBeFilled || [];
    const workTodo = payload.z_track_workToDo || [];

    return {
      ...state,
      notificationFeed: {
        jobIdsWithNewBids,
        myBidsWithNewStatus,
        reviewsToBeFilled,
        workTodo,
      },
    };
  }
};

export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS}`]: updateNotificationFeed,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.OPEN_LOGIN_DIALOG}`]: openLoginDialog,
    [`${A.UI_ACTIONS.CLOSE_LOGIN_DIALOG}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.SHOW_TOAST_MSG}`]: showToastNotification,
  },
  initialState,
);
