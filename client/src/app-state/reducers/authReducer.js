import { handleActions } from 'redux-actions';
import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
};

const setLoggedInState = (state = initialState, { payload }) => ({
  ...state,
  isLoggedIn: true,
});
const setLoggedOutState = (state = initialState, { payload }) => ({
  ...state,
  isLoggedIn: false,
});

export default handleActions(
  {
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_IN}`]: setLoggedInState,
    [`${A.AUTH_ACTIONS.USER_IS_LOGGED_OUT}`]: setLoggedOutState,
  },
  initialState
);
