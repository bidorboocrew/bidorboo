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

export const showSpecialMoment = (specialMomentContent) => (dispatch) =>
  dispatch({
    type: A.UI_ACTIONS.SHOW_SPECIAL_MOMENT,
    payload: { specialMomentContent },
  });

export const setServerAppTaskerView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'TASKER') {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const postData = JSON.stringify({
      data: {
        appViewId: 'TASKER',
      },
    });

    dispatch({
      type: A.USER_MODEL_ACTIONS.UPDATE_USER_APP_VIEW_TO_TASKER,
      payload: axios
        .put(ROUTES.API.USER.PUT.updateAppView, postData, config)
        .then(() => {})
        .catch((error) => {
          console.error(`couldn't save user appview + ${error}`);
        }),
    });

    return dispatch({
      type: A.UI_ACTIONS.SET_APP_TASKER_VIEW,
      payload: 'TASKER',
    });
  }
};

export const setServerAppRequesterView = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'REQUESTER') {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const postData = JSON.stringify({
      data: {
        appViewId: 'REQUESTER',
      },
    });

    dispatch({
      type: A.USER_MODEL_ACTIONS.UPDATE_USER_APP_VIEW_TO_REQUESTER,
      payload: axios
        .put(ROUTES.API.USER.PUT.updateAppView, postData, config)
        .then(() => {})
        .catch((error) => {
          console.error(`couldn't save user appview + ${error}`);
        }),
    });
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_REQUESTER_VIEW,
      payload: 'REQUESTER',
    });
  }
};

export const setAppViewUIToRequester = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'REQUESTER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_REQUESTER_VIEW,
      payload: 'REQUESTER',
    });
  }
};

export const setAppViewUIToTasker = () => (dispatch, getState) => {
  const { userAppView } = getState().uiReducer;
  if (userAppView !== 'TASKER') {
    return dispatch({
      type: A.UI_ACTIONS.SET_APP_TASKER_VIEW,
      payload: 'TASKER',
    });
  }
};
