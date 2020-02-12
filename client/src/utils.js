import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';
import * as ROUTES from './constants/frontend-route-consts';

export const switchRoute = (routeAndParams, stateContent = null) => {
  // if we are NOT on the login or register page
  if (
    window.location.pathname.indexOf(ROUTES.CLIENT.LOGIN_OR_REGISTER) === -1 &&
    routeAndParams.indexOf(ROUTES.CLIENT.LOGIN_OR_REGISTER) > -1
  ) {
    window.localStorage.setItem('bob_lastKnownRoute', `${window.location.pathname}`);
  }

  setTimeout(() => {
    //
    if (stateContent) {
      // console.info('switchign to route ' + routeAndParams);
      appHistory.push({ pathname: routeAndParams, state: { ...stateContent } });
      return null;
    } else {
      // console.info('switchign to route ' + routeAndParams);
      appHistory.push(routeAndParams);
      return null;
    }
  }, 0);

  return null;
};

export const delayedReload = (routeAndParams) => {
  setTimeout(() => window.location.reload(), 1000);
};

export const goBackToPreviousRoute = () => {
  setTimeout(() => {
    appHistory.goBack();
  }, 0);
};

export const throwErrorNotification = (dispatch, error) => {
  let msg = error || 'oops ! something went wrong. We apologise for the inconvenience';
  if (error && error.response && error.response.status === 401) {
    msg = 'You are not authorized! login to perform this action';
  }

  if (error && error.response && error.response.status === 404) {
    msg = 'could not find the requested resource';
  } else if (error && error.response) {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errorMsg &&
      error.response.data.errorMsg.message
    ) {
      msg = error.response.data.errorMsg.message;
    } else if (error && error.response && error.response.data && error.response.data.errorMsg) {
      msg = error.response.data.errorMsg;
    } else if (error && error.response && error.response.data && error.response.data.safeMsg) {
      msg = error.response.data.safeMsg;
    } else {
      msg =
        error && error.response && error.response.data
          ? JSON.stringify(error.response.data)
          : JSON.stringify(error);
    }
  }

  dispatch({
    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
    payload: {
      toastDetails: {
        type: 'error',
        msg: msg ? msg : 'we apologies for the interruption',
      },
    },
  });
};
