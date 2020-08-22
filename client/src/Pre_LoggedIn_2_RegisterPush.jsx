import React from 'react';
import axios from 'axios';

import { getBugsnagClient } from './index';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

var OneSignal = OneSignal || [];

const updateUserSubscription = () => {
  try {
    if (!OneSignal) {
      return;
    }

    // https://documentation.onesignal.com/docs/web-push-sdk#notificationpermissionchange
    OneSignal.push(function () {
      /* These examples are all valid */
      OneSignal.getUserId(function (oneSignalUserId) {
        console.log('OneSignal User ID:', oneSignalUserId);
        axios.post('/api/push/register', {
          data: {
            oneSignalUserId,
          },
        });
      });
    });
  } catch (e) {
    console.log('error updateUserSubscription' + e);
    getBugsnagClient().leaveBreadcrumb(
      'updateUserSubscription Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren',
    );
    getBugsnagClient().notify(e);
  }
};

class Pre_LoggedIn_2_RegisterPush extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb(
      'componentDidCatch Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren',
      {
        debugInfo: info,
      },
    );
    getBugsnagClient().notify(error);
  }

  componentDidUpdate() {
    const { userDetails } = this.props;
    if (!userDetails.userId) {
      return;
    }

    /**
     * for android apps only
     */
    const androidOneSignalId = window.localStorage.getItem('bob_androidOneSignalPlayerId');
    if (androidOneSignalId) {
      if (!OneSignal._initCalled) {
        console.log('initialize one signal callInit');
        OneSignal.push(function () {
          OneSignal.init({
            appId:
              process.env.NODE_ENV === 'production'
                ? process.env.REACT_APP_ONESIGNAL_PUBLIC
                : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
            autoResubscribe: true,
            allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
            promptOptions: {
              slidedown: {
                // https://documentation.onesignal.com/docs/slide-prompt
                enabled: true,
                actionMessage: 'Notify me about MY Requests and Bids',
                /* acceptButtonText limited to 15 characters */
                acceptButtonText: 'YES',
                /* cancelButtonText limited to 15 characters */
                cancelButtonText: 'NO',
              },
              /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
              /* actionMessage limited to 90 characters */
              actionMessage: 'Notify me about MY Requests and Bids',
              /* acceptButtonText limited to 15 characters */
              acceptButtonText: 'YES',
              /* cancelButtonText limited to 15 characters */
              cancelButtonText: 'NO',
            },
            welcomeNotification: {
              disable: true,
            },
          });
        });
      }
      if (window.bidorbooAndroid && window.bidorbooAndroid.setExternalUserOneSignalId) {
        window.bidorbooAndroid.setExternalUserOneSignalId(`${androidOneSignalId}`);
      }
      try {
        // register the user push norification
        axios.post('/api/push/register', {
          data: {
            oneSignalUserId: androidOneSignalId,
          },
        });
      } catch (e) {
        getBugsnagClient().leaveBreadcrumb(
          'updateUserSubscription ANDROID Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren',
        );
        getBugsnagClient().notify(e);
      }
    }
    /********************android app end************************************* */

    if (userDetails.notifications && userDetails.notifications.push) {
      // https://documentation.onesignal.com/docs/sdk-reference
      OneSignal.push(function () {
        if (!OneSignal._initCalled) {
          console.log('initialize one signal callInit');
          OneSignal.push(function () {
            console.log('initialize one signal callInit inside func');
            OneSignal.init({
              appId:
                process.env.NODE_ENV === 'production'
                  ? process.env.REACT_APP_ONESIGNAL_PUBLIC
                  : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
              autoResubscribe: true,
              requiresUserPrivacyConsent: false,
              allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
              promptOptions: {
                // slidedown: {
                //   // https://documentation.onesignal.com/docs/slide-prompt
                //   enabled: true,
                //   actionMessage: 'Notify me about MY Requests and Bids',
                //   /* acceptButtonText limited to 15 characters */
                //   acceptButtonText: 'YES',
                //   /* cancelButtonText limited to 15 characters */
                //   cancelButtonText: 'NO',
                // },
                /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
                /* actionMessage limited to 90 characters */
                actionMessage: 'Notify me about MY Requests and Bids',
                /* acceptButtonText limited to 15 characters */
                acceptButtonText: 'YES',
                /* cancelButtonText limited to 15 characters */
                cancelButtonText: 'NO',
              },
              welcomeNotification: {
                disable: true,
              },
            });
          });
        }
        if (OneSignal._initCalled) {
          const isPushSupported = OneSignal.isPushNotificationsSupported();
          if (!isPushSupported) {
            return;
          }

          OneSignal.on('subscriptionChange', function (isSubscribed) {
            updateUserSubscription(userDetails, isSubscribed);
          });

          OneSignal.isPushNotificationsEnabled(function (isEnabled) {
            if (isEnabled) {
              console.log('Push notifications are enabled!');
              OneSignal.getUserId(function (userId) {
                if (userId === userDetails.userId) {
                  console.log('user already setup');
                  return;
                }

                OneSignal.setLocationShared && OneSignal.setLocationShared(false);
                OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
                OneSignal.setExternalUserId(userDetails.userId);
                if (userDetails.email && userDetails.email.emailAddress) {
                  OneSignal.setEmail(userDetails.email.emailAddress);
                }
                OneSignal.sendTag('userName', userDetails.displayName);
              });
            } else {
              console.log('Push notifications are not enabled yet.');
              OneSignal.showSlidedownPrompt();
            }
          });
        }
      });
    }
  }

  render() {
    return <Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedIn_2_RegisterPush;
