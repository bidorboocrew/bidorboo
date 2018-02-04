//to prepend on any async ation that will generate a promise
export const _REJECTED = '_REJECTED';
export const _PENDING = '_PENDING';
export const _FULFILLED = '_FULFILLED';

export const AUTH_ACTIONS = {
  LOGIN_CLICKED: 'LOGIN_CLICKED',
  LOGIN_FLOW_INITIATED: 'LOGIN_FLOW_INITIATED',
  LOGOUT_CLICKED: 'LOGOUT_CLICKED'
};

export const ROUTE_ACTIONS = {
  LOCATION_CHANGE: '@@router/LOCATION_CHANGE'
};

export const UI_ACTIONS = {
  OPEN_SIDENAV: 'OPEN_SIDENAV',
  CLOSE_SIDENAV: 'CLOSE_SIDENAV'
};
