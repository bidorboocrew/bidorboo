import * as A from '../actionTypes';

export const switchRoute = route => {
  return ({
  type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
  payload: {
    currentRoute: route,
  }
})};
