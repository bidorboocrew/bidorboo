import * as A from '../actionTypes';

export const switchRoute = route => {
  return ({
  type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
  payload: {
    currentRoute: route,
  }
})};
