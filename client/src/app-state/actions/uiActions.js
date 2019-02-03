import * as A from '../actionTypes';

export const showLoginDialog = (shouldOpen) => (dispatch) =>
  dispatch({
    type: shouldOpen ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,
    payload: { shouldShowLoginDialog: shouldOpen },
  });

export const showToastMessage = (toastDetails) => (dispatch) =>
  dispatch({
    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
    payload: { toastDetails: toastDetails },
  });

export const setAppBidderView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;

  if (userAppView !== 'BIDDER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_BIDDER_VIEW,
      payload: 'BIDDER',
    });
  }
};

export const setAppProposerView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'PROPOSER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_PROPOSER_VIEW,
      payload: 'PROPOSER',
    });
  }
};
