import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const getCurrentUser = () => (dispatch) =>
  dispatch({
    type: A.AUTH_ACTIONS.LOGIN_FLOW_INITIATED,
    payload: axios
      .get(ROUTES.API.USER.GET.currentUser)
      .then((resp) => {
        if (resp.data && resp.data.userId) {
          //update everyone that user is now logged in
          dispatch({
            type: A.AUTH_ACTIONS.USER_IS_LOGGED_IN,
          });
          dispatch({
            type: A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE,
            payload: resp.data,
          });

          // initialize uploader widget on window obj

          window.BidOrBoo = window.BidOrBoo ? window.BidOrBoo : {};

          window.BidOrBoo.getCloudinaryWidget = window.BidOrBoo.getCloudinaryWidget
            ? window.BidOrBoo.getCloudinaryWidget
            : (onSuccessHandler, autoclose = true) => {
                const userId = resp.data._id;

                const cloudName = `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`;
                const uploadPreset = `${process.env.REACT_APP_CLOUDINARY_PRESET}`;
                const apiKey = `${process.env.REACT_APP_CLOUDINARY_KEY}`;
                if (!window.BidOrBoo.getCloudinaryWidget.widget) {
                  window.BidOrBoo.getCloudinaryWidget.widget = window.cloudinary.createUploadWidget(
                    {
                      uploadSignature: (callback, paramsToSign) => {
                        axios
                          .get(ROUTES.API.UTILS.GET.signCloudinaryRequest, {
                            params: paramsToSign,
                          })
                          .then((res) => {
                            if (res && res.data) {
                              const { signature } = res.data;

                              callback(signature);
                            }
                          })
                          .catch((e) => {});
                      },
                      cloudName,
                      uploadPreset,
                      apiKey,
                      sources: ['local'],
                      multiple: false,
                      folder: `${userId}/Profile`,
                      tag: 'profile-pic',
                      resourceType: 'image',
                      cropping: true,
                      clientAllowedFormats: ['png', 'gif', 'jpeg', 'tiff', 'jpg', 'bmp'],
                      maxFileSize: 3000000, // 3MB
                      maxImageWidth: 800,
                      maxImageHeight: 600,
                      minImageWidth: 100,
                      minImageHeight: 100,
                      validateMaxWidthHeight: true,
                      croppingValidateDimensions: true,
                      croppingShowDimensions: true,
                      croppingShowBackButton: true,
                      croppingCoordinatesMode: 'custom',
                      showPoweredBy: false,
                      theme: 'minimal',
                      buttonClass: 'button is-primary is-large',
                      buttonCaption: 'Upload image',
                      styles: {
                        palette: {
                          window: '#FFF',
                          windowBorder: '#90A0B3',
                          tabIcon: '#0E2F5A',
                          menuIcons: '#5A616A',
                          textDark: '#000000',
                          textLight: '#FFFFFF',
                          link: '#0078FF',
                          action: '#FF620C',
                          inactiveTabIcon: '#0E2F5A',
                          error: '#F44235',
                          inProgress: '#0078FF',
                          complete: '#20B832',
                          sourceBg: '#eeeeee',
                        },
                        fonts: {
                          Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
                        },
                      },
                      text: {
                        en: {
                          queue: {
                            title: 'Upload Queue',
                            title_uploading_with_counter: 'Uploading {{num}} Assets',
                            title_uploading: 'Uploading Assets',
                            mini_title: 'Uploaded',
                            mini_title_uploading: 'Uploading',
                            show_completed: 'Show completed',
                            retry_failed: 'Retry failed',
                            abort_all: 'Abort all',
                            upload_more: 'Upload More',
                            more: 'More',
                            mini_upload_count: '{{num}} Uploaded',
                            mini_failed: '{{num}} Failed',
                            statuses: {
                              uploading: 'Uploading...',
                              error: 'Error',
                              uploaded: 'Done',
                              aborted: 'Aborted',
                            },
                          },
                          or: 'Or',
                          close: 'Close',
                          menu: {
                            files: 'MY Files',
                          },
                          selection_counter: {
                            selected: 'selected',
                          },
                          actions: {
                            upload: 'Upload',
                            clear_all: 'Clear all',
                            log_out: 'Log out',
                          },
                          notifications: {
                            general_error: 'An error has occurred',
                            general_prompt: 'Are you sure?',
                            limit_reached: 'No more files can be selected',
                            invalid_add_url: 'Added URL must be valid',
                            invalid_public_id: 'Public ID cannot contain \\,?,&,#,%,<,>',
                            no_new_files: 'File(s) have already been uploaded',
                          },
                          landscape_overlay: {
                            title: "Landscape mode isn't supported",
                            description: 'Rotate back to portrait mode to continue.',
                          },
                          local: {
                            main_title: 'BidOrBoo upload profile pic',
                          },
                        },
                      },
                    },
                    (error, result) => {
                      if (result && result.event === 'success') {
                        onSuccessHandler(error, result);
                      } else {
                      }
                    },
                  );
                }
                return window.BidOrBoo.getCloudinaryWidget.widget;
              };
        } else {
          //rediret user to sign up page
          switchRoute(ROUTES.CLIENT.ENTRY);
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
      window.BidOrBoo = null;
      //rediret user to sign up page
      switchRoute(ROUTES.CLIENT.ENTRY);
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
