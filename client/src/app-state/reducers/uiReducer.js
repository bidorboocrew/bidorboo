//will host all UI global changes
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

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.AUTH_ACTIONS.USER_IS_LOGGED_IN:
      return {
        ...state,
        shouldShowLoginDialog: false
      };

    case A.UI_ACTIONS.OPEN_LOGIN_DIALOG:
      return {
        ...state,
        shouldShowLoginDialog: true
      };

    case A.UI_ACTIONS.CLOSE_LOGIN_DIALOG:
      return {
        ...state,
        shouldShowLoginDialog: false
      };

    case A.UI_ACTIONS.SHOW_TOAST_MSG:
      return {
        ...state,
        toastDetails: { ...payload.toastDetails, toastId: uuidv1() }
      };

    default:
      return state;
  }
}
