import * as A from '../actionTypes';

export const showLoginDialog = (shouldOpen) => {
  return {
    type: shouldOpen ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,

    payload: {
      shouldShowLoginDialog: shouldOpen,
    },
  };
};

export const showToastMessage = (toastDetails) => {
  return {
    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
    payload: { toastDetails: toastDetails },
  };
};
