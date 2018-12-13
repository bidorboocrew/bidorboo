import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

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
          //rediret user to sign up page
          switchRoute(ROUTES.CLIENT.ENTRY);
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
          dispatch({
            type: A.USER_MODEL_ACTIONS.SET_CURRENT_USER_DETAILS,
            payload: resp.data,
          });
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
        } else {
          //rediret user to sign up page
          // switchRoute(ROUTES.CLIENT.ENTRY);
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
      switchRoute(ROUTES.CLIENT.ENTRY);
      document.location.reload();
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

// const initializeProfileImgUploaderWidget = (resp) => {
//   window.BidOrBoo = window.BidOrBoo ? window.BidOrBoo : {};
//   window.BidOrBoo.getProfileUploaderWidget = window.BidOrBoo.getProfileUploaderWidget
//     ? window.BidOrBoo.getProfileUploaderWidget
//     : (onSuccessHandler = () => null, onCloseHandler = () => null) => {
//         const userId = resp.data._id;
//         const cloudName = `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`;
//         const uploadPreset = `${process.env.REACT_APP_CLOUDINARY_PRESET}`;
//         const apiKey = `${process.env.REACT_APP_CLOUDINARY_KEY}`;
//         if (!window.BidOrBoo.getProfileUploaderWidget.widget) {
//           window.BidOrBoo.getProfileUploaderWidget.widget = window.cloudinary.createUploadWidget(
//             {
//               uploadSignature: (callback, paramsToSign) => {
//                 axios
//                   .get(ROUTES.API.UTILS.GET.signCloudinaryRequest, {
//                     params: paramsToSign,
//                   })
//                   .then((res) => {
//                     if (res && res.data) {
//                       const { signature } = res.data;
//                       callback(signature);
//                     }
//                   })
//                   .catch((e) => {});
//               },
//               cloudName,
//               publicId: `${userId}-profilepic`, // ensures user got only 1 profile pic
//               uploadPreset,
//               apiKey,
//               sources: ['local'],
//               folder: `${userId}/Profile`,
//               tag: 'profile-pic',
//               resourceType: 'image',
//               clientAllowedFormats: ['png', 'gif', 'jpeg', 'tiff', 'jpg', 'bmp'],
//               maxFileSize: 3000000, //3MB
//               minImageWidth: 50,
//               minImageHeight: 50,
//               maxImageWidth: 600,
//               maxImageHeight: 500,
//               validateMaxWidthHeight: true,
//               croppingValidateDimensions: true,
//               croppingShowDimensions: true,
//               croppingShowBackButton: true,
//               croppingDefaultSelectionRatio: 0.75,
//               showPoweredBy: false,
//               multiple: false,
//               theme: 'minimal',
//               buttonClass: 'button is-primary ',
//               buttonCaption: 'Upload image',
//               styles: {
//                 palette: {
//                   window: '#FFF',
//                   windowBorder: '#90A0B3',
//                   tabIcon: '#0E2F5A',
//                   menuIcons: '#5A616A',
//                   textDark: '#000000',
//                   textLight: '#FFFFFF',
//                   link: '#0078FF',
//                   action: '#FF620C',
//                   inactiveTabIcon: '#0E2F5A',
//                   error: '#F44235',
//                   inProgress: '#0078FF',
//                   complete: '#20B832',
//                   sourceBg: '#eeeeee',
//                 },
//                 fonts: {
//                   Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
//                 },
//               },
//               text: {
//                 en: {
//                   queue: {
//                     title: 'Upload Queue',
//                     title_uploading_with_counter: 'Uploading {{num}} Assets',
//                     title_uploading: 'Uploading Assets',
//                     mini_title: 'Uploaded',
//                     mini_title_uploading: 'Uploading',
//                     show_completed: 'Show completed',
//                     retry_failed: 'Retry failed',
//                     abort_all: 'Abort all',
//                     upload_more: 'Upload More',
//                     more: 'More',
//                     mini_upload_count: '{{num}} Uploaded',
//                     mini_failed: '{{num}} Failed',
//                     statuses: {
//                       uploading: 'Uploading...',
//                       error: 'Error',
//                       uploaded: 'Done',
//                       aborted: 'Aborted',
//                     },
//                   },
//                   or: 'Or',
//                   close: 'Close',
//                   menu: {
//                     files: 'MY Files',
//                   },
//                   selection_counter: {
//                     selected: 'selected',
//                   },
//                   actions: {
//                     upload: 'Upload',
//                     clear_all: 'Clear all',
//                     log_out: 'Log out',
//                   },
//                   notifications: {
//                     general_error: 'An error has occurred',
//                     general_prompt: 'Are you sure?',
//                     limit_reached: 'No more files can be selected',
//                     invalid_add_url: 'Added URL must be valid',
//                     invalid_public_id: 'Public ID cannot contain \\,?,&,#,%,<,>',
//                     no_new_files: 'File(s) have already been uploaded',
//                   },
//                   landscape_overlay: {
//                     title: "Landscape mode isn't supported",
//                     description: 'Rotate back to portrait mode to continue.',
//                   },
//                   local: {
//                     main_title: 'BidOrBoo upload profile pic',
//                   },
//                 },
//               },
//             },
//             (error, result) => {
//               if (result && result.event === 'success') {
//                 onSuccessHandler(error, result);
//                 window.BidOrBoo.getProfileUploaderWidget().close({ quiet: true });
//               }

//               if (result.event === 'abort') {
//                 onCloseHandler();
//                 window.BidOrBoo.getProfileUploaderWidget().close({ quiet: true });
//               }
//             },
//           );
//         }
//         return window.BidOrBoo.getProfileUploaderWidget.widget;
//       };
// };
