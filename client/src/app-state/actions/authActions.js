import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';

export const getCurrentUser = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
      .then(resp => {
        if (resp.data && resp.data.userId) {
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
            payload: resp.data
          });
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data
          });
        } else {
          //rediret user to sign up page
          dispatch({
            type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
            payload: { currentRoute: ROUTES.CLIENT.ENTRY }
          });
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

export const onLogout = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGOUT_FLOW_INITIATED,
    payloads_: axios.get(ROUTES.API.AUTH.LOGOUT).then(resp => {
      dispatch({
        type: A.AUTH_ACTIONS.USER_IS_LOGGED_OUT
      });
      //rediret user to sign up page
      dispatch({
        type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
        payload: { currentRoute: ROUTES.CLIENT.ENTRY }
      });

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
