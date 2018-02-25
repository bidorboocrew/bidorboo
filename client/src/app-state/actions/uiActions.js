import * as A from '../actionTypes';

export const toggleSideNav = isopen => ({
  type: !isopen ? A.UI_ACTIONS.OPEN_SIDENAV : A.UI_ACTIONS.CLOSE_SIDENAV,

  payload: {
    isSideBarOpen: !isopen
  }
});

export const showLoginDialog = isopen => ({
  type: isopen
    ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG
    : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,

  payload: {
    isLoginRegistrationDialogOpen: isopen,
  }
});
