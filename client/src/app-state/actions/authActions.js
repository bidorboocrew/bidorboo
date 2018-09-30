import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute } from '../../utils';

export const getCurrentUser = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
      .then(resp => {
        if (resp.data && resp.data.userId) {
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN
          });
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data
          });
        } else {
          //rediret user to sign up page
          switchRoute(ROUTES.CLIENT.ENTRY);
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === 404) {
          console.log('server wasnt ready');
        } else {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'error',
                msg:
                  'Sorry That did not work, Please try again later.\n' +
                  (error && error.response && error.response.data
                    ? JSON.stringify(error.response.data)
                    : JSON.stringify(error))
              }
            }
          });
        }
      })
  });

export const onLogout = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGOUT_FLOW_INITIATED,
    payload: axios.get(ROUTES.API.AUTH.LOGOUT).then(resp => {
      dispatch({
        type: A.AUTH_ACTIONS.USER_IS_LOGGED_OUT
      });
      //rediret user to sign up page
      switchRoute(ROUTES.CLIENT.ENTRY);
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'info',
            msg: 'You are logged out.'
          }
        }
      });
    })
  });
