import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  userEmail: ''
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.AUTH_ACTIONS.USER_IS_LOGGED_IN: {
      return { ...state, isLoggedIn: true, userEmail: payload.email };
    }
    case A.AUTH_ACTIONS.USER_IS_LOGGED_OUT: {
      return { ...state, isLoggedIn: false, userEmail: '' };
    }
    default:
      return state;
  }
}
