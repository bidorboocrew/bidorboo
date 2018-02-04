import * as A from "../actionTypes";

const initialState = {
  path: '/'
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.ROUTE_ACTIONS.LOCATION_CHANGE:
    debugger;
    case '@@router/LOCATION_CHANGE':
    debugger;
    default:
      return state;
  }
}
