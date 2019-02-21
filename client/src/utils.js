import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';
import moment from 'moment-timezone';

export const switchRoute = (routeAndParams, stateContent = null) => {
  // setTimeout(() => {
    if (stateContent) {
      appHistory.push({ pathname: routeAndParams, state: { ...stateContent } });
    } else {
      appHistory.push(routeAndParams);
    }
  // }, 0);
};

export const goBackToPreviousRoute = () => {
  setTimeout(() => {
    appHistory.goBack();
  }, 0);
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

export const isHappeningToday = (eventPlannedTimeISOString) => {
  const localStartOfDay = moment()
    .startOf('day')
    .toISOString();
  const localEndOfDay = moment()
    .endOf('day')
    .toISOString();

  const eventPlannedTime = moment(eventPlannedTimeISOString).toISOString();
  const isAfterStartOfTOday = moment(eventPlannedTime).isAfter(localStartOfDay);
  const isBeforeEndOfToday = moment(eventPlannedTime).isSameOrBefore(localEndOfDay);
  return isAfterStartOfTOday && isBeforeEndOfToday;
};

export const isBeforeToday = (eventPlannedTimeISOString) => {
  const localEndOfDay = moment()
    .endOf('day')
    .toISOString();

  const eventPlannedTime = moment(eventPlannedTimeISOString).toISOString();
  const isBeforeEndOfToday = moment(eventPlannedTime).isSameOrBefore(localEndOfDay);
  return isBeforeEndOfToday;
};

export const isBidderView = () => {
  return window.location.href.indexOf('bidder') > -1;
};
