import React from 'react';
import axios from 'axios';

import { getBugsnagClient } from './index';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

var OneSignal = window.OneSignal || [];
const updateUserSubscription = (userDetails) => {
  console.log('updateUserSubscription');
  try {
    if (!OneSignal) {
      return;
    }

    // https://documentation.onesignal.com/docs/web-push-sdk#notificationpermissionchange
    OneSignal.push(function () {
      console.log('OneSignal.push updateUserSubscription');

      /* These examples are all valid */
      OneSignal.getUserId().then(function (oneSignalUserId) {
        console.log('OneSignal User ID:', oneSignalUserId);
        if (oneSignalUserId === userDetails.oneSignalUserId) {
          console.log('no update needed');
        } else {
          console.log('update onesignal player Id needed');
          axios.post('/api/push/register', {
            data: {
              oneSignalUserId,
            },
          });
        }
      });
    });
  } catch (e) {
    console.error('error updateUserSubscription' + e);
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

  componentDidMount() {
    const { userDetails } = this.props;

    if (!userDetails.userId) {
      return;
    }

    // https://documentation.onesignal.com/docs/sdk-reference
    OneSignal.push(function () {
      if (!OneSignal._initCalled) {
        OneSignal.push(function () {
          OneSignal.init({
            appId:
              process.env.NODE_ENV === 'production'
                ? process.env.REACT_APP_ONESIGNAL_PUBLIC
                : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
            autoResubscribe: true,
            requiresUserPrivacyConsent: false,
            // allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
            promptOptions: {
              /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
              /* actionMessage limited to 90 characters */
              actionMessage: 'Enable My Requests and Bids Notification',
              /* acceptButtonText limited to 15 characters */
              acceptButtonText: 'YES - Enable it',
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
        updateUserSubscription(userDetails);

        // OneSignal.showNativePrompt();
        OneSignal.setLocationShared && OneSignal.setLocationShared(false);
        OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
        OneSignal.setExternalUserId(userDetails.userId);
        if (userDetails.email && userDetails.email.emailAddress) {
          OneSignal.setEmail(userDetails.email.emailAddress);
        }
        OneSignal.sendTags({ ...userDetails });

        // OneSignal.on('subscriptionChange', function (isSubscribed) {
        //   updateUserSubscription(userDetails);
        // });

        OneSignal.showSlidedownPrompt();
      }
    });

    try {
      /**
       * for android apps only
       */
      const androidOneSignalId = window.localStorage.getItem('bob_androidOneSignalPlayerId');
      if (androidOneSignalId) {
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
    } catch (e) {
      console.error(e);
    }
    /********************android app end************************************* */
  }

  render() {
    return <Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedIn_2_RegisterPush;
