import * as A from '../actionTypes';
import * as ROUTES from '../../route_const';

import axios from 'axios';

export const getCurrentUser = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.GOOGLE_LOGIN_FLOW_INITIATED,
    payloads_: axios
      .get(ROUTES.BACKENDROUTES.USERAPI.GET_CURRENTUSER)
      .then(resp => {
        if (resp.data && resp.data.email) {
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
            payload: resp.data
          });
        } else {
          //rediret user to sign up page
          dispatch({
            type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
            payload: { pathname: ROUTES.FRONTENDROUTES.ENTRY }
          });
        }
      })
      .catch(error => {
        debugger;
        console.log(error.response);
      })
  });

export const onLogout = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGOUT_FLOW_INITIATED,
    payloads_: axios.get(ROUTES.BACKENDROUTES.AUTH.LOGOUT).then(resp => {
      dispatch({
        type: A.AUTH_ACTIONS.USER_IS_LOGGED_OUT
      });
    })
  });
