import * as A from '../actionTypes';

const initialState = {
  currentRoute: '/'
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE:
      return { ...state, currentRoute: payload.currentRoute };
    default:
      return state;
  }
}
