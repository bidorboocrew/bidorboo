import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const getCurrentUserNotifications = () => (dispatch) =>
  dispatch({
    type: A.UI_ACTIONS.GET_CURRENT_USER_NOTIFICATIONS,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
        } else {
          //rediret user to sign up page
          switchRoute(ROUTES.CLIENT.ENTRY);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const getCurrentUser = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
        } else {
          //rediret user to sign up page
          // switchRoute(ROUTES.CLIENT.ENTRY);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const onLogout = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGOUT_FLOW_INITIATED,
    payload: axios.get(ROUTES.API.AUTH.LOGOUT).then((resp) => {
      dispatch({
        type: A.AUTH_ACTIONS.USER_IS_LOGGED_OUT,
      });
      //rediret user to sign up page
      switchRoute(ROUTES.CLIENT.ENTRY);
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'info',
            msg: 'You are logged out.',
          },
        },
      });
    }),
  });

export const bidOrBooLogin = (userData) => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .post(ROUTES.API.AUTH.LOCAL_LOGIN, {
        ...userData,
      })
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
        } else {
          //rediret user to sign up page
          // switchRoute(ROUTES.CLIENT.ENTRY);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const registerNewUser = (userData) => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.REGISTER_NEW_USER,
    payload: axios
      .post(ROUTES.API.AUTH.REGISTER_NEW_USER, {
        ...userData,
      })
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
        } else {
          //rediret user to sign up page
          // switchRoute(ROUTES.CLIENT.ENTRY);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
