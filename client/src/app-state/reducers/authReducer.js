import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case A.AUTH_ACTIONS.USER_IS_LOGGED_IN: {
      return { ...state, isLoggedIn: true };
    }
    case A.AUTH_ACTIONS.USER_IS_LOGGED_OUT: {
      return { ...state, ...initialState };
    }
    default:
      return state;
  }
}
