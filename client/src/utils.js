import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';

export const switchRoute = routeAndParams => {
  appHistory.push(routeAndParams);
};

export const throwErrorNotification = (dispatch, error) => {
  let msg = 'sorry something went wrong';

  if (error && error.response && error.response.status === 404) {
    msg = 'could not find the requested resource';
  }
  else if (error && error.response) {
    msg =
      error && error.response && error.response.data
        ? JSON.stringify(error.response.data)
        : JSON.stringify(error);
  }
  dispatch({
    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
    payload: {
      toastDetails: {
        type: 'error',
        msg: msg
      }
    }
  });
};
