import * as A from '../actionTypes';

const initialState = {
  pathname: '/'
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.ROUTE_ACTIONS.LOCATION_CHANGE:
      return { ...state, pathname: payload.pathname };
    default:
      return state;
  }
}
