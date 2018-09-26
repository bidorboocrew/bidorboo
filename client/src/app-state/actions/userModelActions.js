import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';

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
    type: A.JOB_ACTIONS.DELETE_JOB_BY_ID,
    payload: axios
      .put(ROUTES.API.USER.PUT.profilePicture, data, config)
      .then(e => {
        //debugger
      })
      .catch(error => {
        dispatch({
          type: A.USER_MODEL_ACTIONS.UPDATE_USER_IMAGE,
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
      })
  });
};
