import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';
import uuidv1 from 'uuid/v1';

const initialState = {
  shouldShowLoginDialog: false,
  /**
   * toastDetails : {toastType : warning|successful|error , Msg: string, toastId: uuid}
   */
  toastDetails: {}
  // applicationMode: C.APP_MODE.BIDDER
};

const closeLoginDialog = (state = initialState, { payload }) => ({
  ...state,
  shouldShowLoginDialog: false
});
const openLoginDialog = (state = initialState, { payload }) => ({
  ...state,
  shouldShowLoginDialog: true
});
const showToastNotification = (state = initialState, { payload }) => ({
  ...state,
  toastDetails: { ...payload.toastDetails, toastId: uuidv1() }
});

export default handleActions(
  {
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.OPEN_LOGIN_DIALOG}`]: openLoginDialog,
    [`${A.UI_ACTIONS.CLOSE_LOGIN_DIALOG}`]: closeLoginDialog,
    [`${A.UI_ACTIONS.SHOW_TOAST_MSG}`]: showToastNotification
  },
  initialState
);
