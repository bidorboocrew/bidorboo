import * as A from '../actionTypes';

export const toggleSideNav = isopen => ({
  type: !isopen ? A.UI_ACTIONS.OPEN_SIDENAV : A.UI_ACTIONS.CLOSE_SIDENAV,

  payload: {
    isSideBarOpen: !isopen
  }
});

export const toggleLoginRegistrationForm = (isopen, loginClickSrc = '') => ({
  type: isopen
    ? A.UI_ACTIONS.OPEN_LOGIN_REGISTRATION_FORM
    : A.UI_ACTIONS.CLOSE_LOGIN_REGISTRATION_FORM,

  payload: {
    isLoginRegistrationDialogOpen: isopen,
    loginClickSrc: loginClickSrc
  }
});
