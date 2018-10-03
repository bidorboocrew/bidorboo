import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const updateProfileDetails = profileDetails => (dispatch, getState) => {
  const updateProfileCall = axios
    .put(ROUTES.API.USER.PUT.userDetails, {
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
      throwErrorNotification(dispatch, error);
    });

  return dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE_REQUEST,
    payload: updateProfileCall
  });
};

export const updateProfileImage = files => dispatch => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' }
  };
  let data = new FormData();
  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    data.append('filesToUpload', file, file.name);
  }

  dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_IMAGE,
    payload: axios
      .put(ROUTES.API.USER.PUT.profilePicture, data, config)
      .then(resp => {
        if (resp.data && resp.data.userId) {
          //update profile data
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data
          });
        }
      })
      .catch(error => {
        throwErrorNotification(dispatch, error);
      })
  });
};
