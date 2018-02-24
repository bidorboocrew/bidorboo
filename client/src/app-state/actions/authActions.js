import * as A from '../actionTypes';
import * as ROUTES from '../../route_const';

import axios from 'axios';

export const onLoginGoogle = () => (dispatch, getState) =>
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

export const onSubmitRegistrationForm = values => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.NEWUSER_REGISETRATION_FLOW_INITIATED,
    payload: axios
      .post(ROUTES.BACKENDROUTES.AUTH.REGISTER, { ...values })
      .then(resp => {
        debugger;
        if (resp.data && resp.data.email) {
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
            payload: resp.data
          });
          dispatch({
            type: A.UI_ACTIONS.CLOSE_LOGIN_REGISTRATION_FORM,
            payload: ''
          });
        }
      })
  });

export const onSubmitLoginForm = values => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.NEWUSER_REGISETRATION_FLOW_INITIATED,
    payload: axios
      .post(ROUTES.BACKENDROUTES.AUTH.LOGIN, { ...values })
      .then(resp => {
        debugger;
        if (resp.data && resp.data.email) {
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
            payload: resp.data
          });
          dispatch({
            type: A.UI_ACTIONS.CLOSE_LOGIN_REGISTRATION_FORM,
            payload: ''
          });
        }
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
