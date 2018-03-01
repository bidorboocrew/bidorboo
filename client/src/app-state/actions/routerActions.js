import * as A from '../actionTypes';

const initialState = {
  currentRoute: '/'
};

export const switchRoute = route => ({
  type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
  payload: {
    currentRoute: route,
  }
});
