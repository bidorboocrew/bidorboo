import * as A from '../actionTypes';
import axios from 'axios';

export const a_onLogin = () => {
  return (dispatch, getState) => {
    dispatch({
      type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
      payload: axios.get('/api/current_user').then(resp => {
        debugger;
        if (resp.data && resp.data.Id) {
          dispatch({ type: A.AUTH_ACTIONS.USER_LOGGED_IN, payload: resp.data });
        }
      })
    });
  };
};
