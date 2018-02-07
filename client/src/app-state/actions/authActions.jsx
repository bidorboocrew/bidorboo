import * as A from '../actionTypes';
import * as ROUTES from '../../utils/route_constants';

import axios from 'axios';

export const a_onLogin = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios.get(ROUTES.BACKENDROUTES.API.GET_CURRENTUSER).then(resp => {
      if (resp.data && resp.data.Id) {
        dispatch({ type: A.AUTH_ACTIONS.USER_LOGGED_IN, payload: resp.data });
      } else {
        //rediret user to sign up page
        dispatch({
          type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
          payload: { pathname: ROUTES.FRONTENDROUTES.ENTRY }
        });
      }
    })
  });
