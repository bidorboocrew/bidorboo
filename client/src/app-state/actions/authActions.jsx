import * as A from '../actionTypes';

export const a_onLogin = () => {
    debugger;

  return (dispatch, getState) => {
    dispatch({ type: A.AUTH_ACTIONS.LOGIN_CLICKED, payload: {} });
    dispatch({
      type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
      payload: fetch('/auth/google')
        .then(resp => {
          debugger;
          return resp.json();
        })
        .then(jsonResp => {
          debugger;
          return jsonResp;
        })
    });
  };
};
