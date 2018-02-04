//to prepend on any async ation that will generate a promise
export const _REJECTED = '_REJECTED';
export const _PENDING = '_PENDING';
export const _FULFILLED = '_FULFILLED';

export const AUTH_ACTIONS = {
  LOGIN_FLOW_INITIATED: 'LOGIN_FLOW_INITIATED',
  USER_LOGGED_IN: 'USER_LOGGED_IN'
};

export const ROUTE_ACTIONS = {
  LOCATION_CHANGE: '@@router/LOCATION_CHANGE'
};

export const UI_ACTIONS = {
  OPEN_SIDENAV: 'OPEN_SIDENAV',
  CLOSE_SIDENAV: 'CLOSE_SIDENAV'
};
