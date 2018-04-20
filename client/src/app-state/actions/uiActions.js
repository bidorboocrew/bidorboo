import * as A from '../actionTypes';

export const showLoginDialog = shouldOpen => {
  return {
  type: shouldOpen
    ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG
    : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,

  payload: {
    shouldShowLoginDialog: shouldOpen,
  }
}};
