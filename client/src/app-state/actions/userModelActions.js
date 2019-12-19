import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { throwErrorNotification } from '../../utils';

export const updateNotificationSettings = (notificationSettings) => (dispatch) => {
  return dispatch({
    type: A.USER_MODEL_ACTIONS.UPDATE_USER_NOTIFICATION_SETTINGS,
    payload: axios
      .put(ROUTES.API.USER.PUT.notificationSettings, {
        data: {
          ...notificationSettings,
        },
      })
      .catch((error) => {
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

export const updateOnBoardingDetails = ({ agreedToTOS }, callback = () => null) => (dispatch) => {
  return dispatch({
    type: A.USER_MODEL_ACTIONS.F,
    payload: axios
      .put(ROUTES.API.USER.PUT.updateOnboardingDetails, {
        data: {
          agreedToTOS,
        },
      })
      .then((resp) => {
        if (resp.data && resp.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: `Congratulations. you are all setup`,
              },
            },
          });
          callback();
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
