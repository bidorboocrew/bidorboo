import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const verifyPhone = (code) => (dispatch) => {
  dispatch({
    type: A.UI_ACTIONS.VERIFY_USER_PHONE,
    payload: axios
      .post(ROUTES.API.USER.POST.verifyPhone, {
        data: { code },
      })
      .then((verifyReq) => {
        //rediret user to my profile
        switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
        if (verifyReq && verifyReq.data && verifyReq.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: `Congratulations. Your phone is now verified`,
              },
            },
          });
          getCurrentUserNotifications()(dispatch);
        } else {
          throwErrorNotification(
            dispatch,
            'Sorry! We Could Not Verify your phone. click on resend pin and verify later. or contact us at bidorboocrew@bidorboo.com',
          );
        }
      })
      .catch((error) => {
        //rediret user to my profile
        switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
        throwErrorNotification(dispatch, error);
      }),
  });
};
export const verifyEmail = (code) => (dispatch) => {
  dispatch({
    type: A.UI_ACTIONS.VERIFY_USER_EMAIL,
    payload: axios
      .post(ROUTES.API.USER.POST.verifyEmail, {
        data: { code },
      })
      .then((verifyReq) => {
        //rediret user to my profile
        switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
        if (verifyReq && verifyReq.data && verifyReq.data.success) {
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: `Congratulations. Your Email is now verified`,
              },
            },
          });
          getCurrentUserNotifications()(dispatch);
        } else {
          throwErrorNotification(
            dispatch,
            'Sorry! We Could Not Verify your email. click on resend pin and verify later. or contact us at bidorboocrew@bidorboo.com',
          );
        }
      })
      .catch((error) => {
        //rediret user to my profile
        switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
        throwErrorNotification(dispatch, error);
      }),
  });
};
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
          switchRoute(ROUTES.CLIENT.HOME);
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
          const {
            appView,
            canBid,
            canPost,
            displayName,
            email,
            phone,
            membershipStatus,
            userId,
            _id,
            rating,
          } = resp.data;
          // Make sure fcWidget.init is included before setting these values

          // To set unique user id in your system when it is available
          window.fcWidget.setExternalId(userId);
          // To set user name
          window.fcWidget.user.setFirstName(displayName);
          // To set user email
          window.fcWidget.user.setEmail((email && email.emailAddress) || '');
          // To set user properties
          window.fcWidget.user.setProperties({
            appView,
            canBid,
            canPost,
            displayName,
            email: JSON.stringify(email),
            phone: JSON.stringify(phone),
            rating: JSON.stringify(rating),
            membershipStatus,
            userId,
            _id,
          });

          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
          // xxxx stupid welcome notification
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: `Welcome to BidOrBoo ${resp.data.displayName || resp.data.email.emailAddress}`,
              },
            },
          });
          if (resp.data.appView) {
            if (resp.data.appView === 'BIDDER') {
              dispatch({
                type: A.UI_ACTIONS.SET_APP_BIDDER_VIEW,
                payload: 'BIDDER',
              });
            } else {
              dispatch({
                type: A.UI_ACTIONS.SET_APP_PROPOSER_VIEW,
                payload: 'PROPOSER',
              });
            }
          }

          if (resp.data.membershipStatus === 'NEW_MEMBER') {
            switchRoute(ROUTES.CLIENT.ONBOARDING);
          }
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
      switchRoute(ROUTES.CLIENT.HOME);
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
          // xxx stupid welcome notification
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: `Welcome to BidOrBoo ${resp.data.displayName || resp.data.email.emailAddress}`,
              },
            },
          });
        } else {
          //rediret user to sign up page
          // switchRoute(ROUTES.CLIENT.HOME);
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

          switchRoute(ROUTES.CLIENT.ONBOARDING);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
