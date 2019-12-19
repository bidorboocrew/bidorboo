import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';

export const switchRoute = (routeAndParams, stateContent = null) => {
  debugger;
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
  console.error(routeAndParams);
  setTimeout(() => window.location.reload(), 3000);
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
