import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';
import moment from 'moment-timezone';

export const switchRoute = (routeAndParams, stateContent = null) => {
  if (stateContent) {
    appHistory.push({ pathname: routeAndParams, state: { ...stateContent } });
  } else {
    appHistory.push(routeAndParams);
  }
};

export const throwErrorNotification = (dispatch, error) => {
  let msg = 'sorry something went wrong';
  if (error && error.response && error.response.status === 404) {
    msg = 'could not find the requested resource';
  } else if (error && error.response) {
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
        msg: msg ? msg : 'we apologies for the interruption',
      },
    },
  });
};

export const getLocalDate = (UTCdate, formatPattern = 'YYYY-MM-DD HH:mm z') => {
  if (moment(UTCdate).isValid()) {
    const localTimezone = moment.tz.guess() || 'America/Los_Angeles';
    return moment
      .utc(UTCdate)
      .tz(localTimezone)
      .format(formatPattern);
  }
};

export const BULMA_RESPONSIVE_SCREEN_SIZES = {
  mobile: 768,
  tablet: 769,
  desktop: 1024,
  widescreen: 1216,
  fullhd: 1408,
  isMobile: ({ windowWidth }) => {
    return windowWidth < 768;
  },
};
