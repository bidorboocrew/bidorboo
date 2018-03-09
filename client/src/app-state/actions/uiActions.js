import * as A from '../actionTypes';

export const showLoginDialog = isopen => ({
  type: isopen
    ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG
    : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,

  payload: {
    isLoginRegistrationDialogOpen: isopen,
  }
});
