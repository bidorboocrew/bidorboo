import * as A from '../actionTypes';
import * as ROUTES from '../../constants/route_const';
import { USER_MEMBERSHIP_STATUS } from '../../constants/constants';
import axios from 'axios';

export const getCurrentUser = () => (dispatch, getState) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payloads_: axios
      .get(ROUTES.BACKENDROUTES.USERAPI.GET_CURRENTUSER)
      .then(resp => {
        if (resp.data && resp.data.userId) {
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
            payload: resp.data
          });

          // if NEW_USER open sidenav + show profile page so they can fill the details
          // switch (resp.data.membershipStatus) {
          //   case USER_MEMBERSHIP_STATUS.NEW_MEMBER:
          //     //navigate to my profile page
          //     dispatch({
          //       type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
          //       payload: { currentRoute: ROUTES.FRONTENDROUTES.MY_PROFILE }
          //     });
          //     break;
          //   default:
          //     dispatch({
          //       type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
          //       payload: { currentRoute: ROUTES.FRONTENDROUTES.HOME }
          //     });
          //     break;
          // }
        } else {
          //rediret user to sign up page
          dispatch({
            type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
            payload: { currentRoute: ROUTES.FRONTENDROUTES.ENTRY }
          });
        }
      })
      .catch(error => {
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
      //rediret user to sign up page
      dispatch({
        type: A.ROUTE_ACTIONS.LOCATION_CHANGE,
        payload: { currentRoute: ROUTES.FRONTENDROUTES.ENTRY }
      });
      // close side panel to educate the user that we do have a side panel
      dispatch({
        type: A.UI_ACTIONS.CLOSE_SIDENAV
      });
    })
  });
