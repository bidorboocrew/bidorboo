import axios from 'axios';
import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';

export const showLoginDialog = (shouldOpen) => (dispatch) => {
  dispatch({
    type: shouldOpen ? A.UI_ACTIONS.OPEN_LOGIN_DIALOG : A.UI_ACTIONS.CLOSE_LOGIN_DIALOG,
    payload: { shouldShowLoginDialog: shouldOpen },
  });
};

export const showToastMessage = (toastDetails) => (dispatch) =>
  dispatch({
    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
    payload: { toastDetails: toastDetails },
  });

export const setServerAppBidderView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'BIDDER') {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const postData = JSON.stringify({
      data: {
        appViewId: 'BIDDER',
      },
    });

    dispatch({
      type: A.USER_MODEL_ACTIONS.UPDATE_USER_APP_VIEW_TO_BIDDER,
      payload: axios
        .put(ROUTES.API.USER.PUT.updateAppView, postData, config)
        .then(() => {})
        .catch((error) => {
          // throwErrorNotification(dispatch, error);
          console.error(`couldn't save user appview + ${error}`);
        }),
    });

    return dispatch({
      type: A.UI_ACTIONS.SET_APP_BIDDER_VIEW,
      payload: 'BIDDER',
    });
  }
};

export const setServerAppProposerView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'PROPOSER') {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const postData = JSON.stringify({
      data: {
        appViewId: 'PROPOSER',
      },
    });

    dispatch({
      type: A.USER_MODEL_ACTIONS.UPDATE_USER_APP_VIEW_TO_PROPOSER,
      payload: axios
        .put(ROUTES.API.USER.PUT.updateAppView, postData, config)
        .then(() => {})
        .catch((error) => {
          // throwErrorNotification(dispatch, error);
          console.error(`couldn't save user appview + ${error}`);
        }),
    });
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_PROPOSER_VIEW,
      payload: 'PROPOSER',
    });
  }
};

export const setAppViewUIToProposer = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'PROPOSER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_PROPOSER_VIEW,
      payload: 'PROPOSER',
    });
  }
};

export const setAppViewUIToBidder = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'BIDDER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_BIDDER_VIEW,
      payload: 'BIDDER',
    });
  }
};
