import * as A from '../actionTypes';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const verifyPhone = (code, onSuccessCallback = () => null) => (dispatch) => {
  dispatch({
    type: A.UI_ACTIONS.VERIFY_USER_PHONE,
    payload: axios
      .post(ROUTES.API.USER.POST.verifyPhone, {
        data: { code: `${code}` },
      })
      .then(async (verifyReq) => {
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
          await sleep(3000);
          getCurrentUser()(dispatch);

          onSuccessCallback && onSuccessCallback();
        } else {
          throwErrorNotification(
            dispatch,
            'Sorry! We Could Not Verify your phone. click on resend pin and verify later. or contact us at bidorboo@bidorboo.ca',
          );
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
export const verifyEmail = (code, onSuccessCallback = () => null) => (dispatch) => {
  dispatch({
    type: A.UI_ACTIONS.VERIFY_USER_EMAIL,
    payload: axios
      .post(ROUTES.API.USER.POST.verifyEmail, {
        data: { code },
      })
      .then(async (verifyReq) => {
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
          await sleep(3000);
          getCurrentUser()(dispatch);

          onSuccessCallback && onSuccessCallback();
        } else {
          throwErrorNotification(
            dispatch,
            'Sorry! We Could Not Verify your email. click on resend pin and verify later. or contact us at bidorboo@bidorboo.ca',
          );
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};
// export const getCurrentUserNotifications = () => (dispatch) => {
//   dispatch({
//     type: A.UI_ACTIONS.GET_CURRENT_USER_NOTIFICATIONS,
//     payload: axios
//       .get(ROUTES.API.USER.GET.currentUser)
//       .then((resp) => {
//         if (resp.data && resp.data.userId) {
//           dispatch({
//             type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
//             payload: resp.data,
//           });
//         }
//       })
//       .catch((error) => {
//         throwErrorNotification(dispatch, error);
//       }),
//   });
// };
export const getCurrentUser = () => (dispatch) => {
  return dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
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

          if (resp.data.appView) {
            if (resp.data.appView === 'TASKER') {
              dispatch({
                type: A.UI_ACTIONS.SET_APP_TASKER_VIEW,
                payload: 'TASKER',
              });
            } else {
              dispatch({
                type: A.UI_ACTIONS.SET_APP_REQUESTER_VIEW,
                payload: 'REQUESTER',
              });
            }
          }
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const onLogout = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGOUT_FLOW_INITIATED,
    payload: axios.get(ROUTES.API.AUTH.LOGOUT).then(async () => {
      dispatch({
        type: A.AUTH_ACTIONS.USER_IS_LOGGED_OUT,
      });
      //rediret user to sign up page
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'info',
            msg: 'You logged out.',
          },
        },
      });

      if (window.OneSignal) {
        window.OneSignal.removeExternalUserId();
      }

      /**
       * for android apps only
       */
      window.localStorage.removeItem('bob_androidOneSignalPlayerId');
      if (window.bidorbooAndroid && window.bidorbooAndroid.removeExternalUserOneSignalId) {
        window.bidorbooAndroid.removeExternalUserOneSignalId();
      }
      /********************************************************* */

      window.localStorage.removeItem('bob_lastKnownRoute');
      switchRoute(ROUTES.CLIENT.HOME);
      window.location.reload();
    }),
  });

export const bidOrBooLogin = (userData) => (dispatch) =>
  dispatch({
    type: 'A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED',
    payload: axios
      .post(ROUTES.API.AUTH.LOCAL_LOGIN, {
        ...userData,
      })
      .then((resp) => {
        if (resp.data && resp.data.user && resp.data.user.userId) {
          // dispatch({
          //   type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
          //   payload: resp.data.user,
          // });
          //update everyone that user is now logged in
          // dispatch({
          //   type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          // });
          getCurrentUser()(dispatch);
          // xxx redirect
          // switchRoute(resp.data.redirectUrl);
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
        if (resp.data && resp.data.user && resp.data.user.userId) {
          // dispatch({
          //   type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
          //   payload: resp.data.user,
          // });
          //update everyone that user is now logged in
          // dispatch({
          //   type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          // });
          getCurrentUser()(dispatch);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
