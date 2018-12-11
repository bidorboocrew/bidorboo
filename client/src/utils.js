import appHistory from './react-router-history';
import * as A from './app-state/actionTypes';
import moment from 'moment-timezone';

export const switchRoute = (routeAndParams, stateContent = null) => {
  console.log(routeAndParams);
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
//push notification
export const payloadFromSubscription = function(subscription) {
  var key = subscription.getKey ? subscription.getKey('p256dh') : '';
  var auth = subscription.getKey ? subscription.getKey('auth') : '';
  // NOTE: p256dg and auth are encoded into std base64, NOT urlsafe base64
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
      auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : '',
    },
  };
};

export const urlB64ToUint8Array = function(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};