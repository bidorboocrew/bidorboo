import * as A from '../actionTypes';
import * as ROUTES from '../../constants/route_const';
import axios from 'axios';

export const updateProfileDetails = profileDetails => (dispatch, getState) => {
debugger;
  const updateProfileCall = axios
    .put(ROUTES.BACKENDROUTES.USERAPI.PUT_UPDATE_PROFILE_DETAILS, {
      data: profileDetails
    })
    .then(resp => {
      if (resp.data && resp.data.userId) {
        //update everyone that user is now logged in
 //update everyone that user is now logged in
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data
          });
      }
    })
    .catch(error => {
      console.log(error.response);
    });

  return dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE_REQUEST,
    payload: updateProfileCall
  });
};
