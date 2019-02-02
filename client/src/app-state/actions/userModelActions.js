import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const getMyPastRequestedServices = () => (dispatch) => {
  return dispatch({
    type: A.USER_MODEL_ACTIONS.GET_MY_PAST_REQUESTED_SERVICES,
    payload: axios.get(ROUTES.API.USER.GET.getMyPastRequestedServices).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const getMyPastProvidedServices = () => (dispatch) => {
  dispatch({
    type: A.USER_MODEL_ACTIONS.GET_MY_PAST_PROVIDED_SERVICES,
    payload: axios.get(ROUTES.API.USER.GET.getMyPastProvidedServices).catch((error) => {
      throwErrorNotification(dispatch, error);
    }),
  });
};

export const updateProfileDetails = (profileDetails) => (dispatch) => {
  const updateProfileCall = axios
    .put(ROUTES.API.USER.PUT.userDetails, {
      data: profileDetails,
    })
    .then((resp) => {
      if (resp.data && resp.data.userId) {
        //update everyone that user is now logged in
        //update everyone that user is now logged in
        dispatch({
          type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
          payload: resp.data,
        });
      }
    })
    .catch((error) => {
      throwErrorNotification(dispatch, error);
    });

  return dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE_REQUEST,
    payload: updateProfileCall,
  });
};

export const updateProfileImage = (imgFile) => (dispatch) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  let data = new FormData();

  data.append('filesToUpload', imgFile);

  dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_IMAGE,
    payload: axios
      .put(ROUTES.API.USER.PUT.profilePicture, data, config)
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          //update profile data
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data,
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getOtherUserProfileInfo = (otherUserId) => (dispatch) =>
  dispatch({
    type: A.USER_MODEL_ACTIONS.GET_OTHER_USER_PROFILE_INFO,
    payload: axios
      .get(ROUTES.API.USER.GET.otherUserProfileInfo, { params: { otherUserId } })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
