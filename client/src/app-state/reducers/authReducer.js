import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  userDetails: {}
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.AUTH_ACTIONS.USER_IS_LOGGED_IN: {
      return { ...state, isLoggedIn: true, userDetails: payload };
    }
    case A.AUTH_ACTIONS.USER_IS_LOGGED_OUT: {
      return { ...state, isLoggedIn: false, userDetails: {} };
    }
    default:
      return state;
  }
}
