import React from 'react';
import axios from 'axios';

import { getBugsnagClient } from './index';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

var OneSignal = OneSignal || [];
const updateUserSubscription = async (userDetails, isSubscribed) => {
  try {
    let externalUserId = '';
    if (OneSignal) {
      externalUserId = await OneSignal.getExternalUserId();
    }

    if (externalUserId !== userDetails.userId) {
      const oneSignalUserId = await OneSignal.getUserId();
      if (oneSignalUserId) {
        debugger;
        await axios.post('/api/push/register', {
          data: {
            oneSignalUserId,
          },
        });
      }
    }
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

  componentDidMount() {
    const { userDetails } = this.props;

    if (OneSignal && !OneSignal._initCalled) {
      OneSignal.push(function () {
        OneSignal.init({
          appId:
            process.env.NODE_ENV === 'production'
              ? process.env.REACT_APP_ONESIGNAL_PUBLIC
              : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
          autoResubscribe: true,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
          promptOptions: {
            /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
            /* actionMessage limited to 90 characters */
            actionMessage: 'Get Notified about Your Requests and Bids',
            /* acceptButtonText limited to 15 characters */
            acceptButtonText: 'ALLOW',
            /* cancelButtonText limited to 15 characters */
            cancelButtonText: 'NO THANKS',
          },
          welcomeNotification: {
            disable: true,
          },
        });
      });
    }

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
    /********************android app end************************************* */

    if (userDetails.notifications && userDetails.notifications.push) {
      // https://documentation.onesignal.com/docs/sdk-reference
      OneSignal.push(function () {
        debugger;
        process.env.NODE_ENV !== 'production' && OneSignal.log.setLevel('trace');
        OneSignal.setLocationShared && OneSignal.setLocationShared(false);
        OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
        OneSignal.setExternalUserId(userDetails.userId);
        OneSignal.sendTag('userName', userDetails.displayName);

        OneSignal.showSlidedownPrompt();
        OneSignal.on('subscriptionChange', function (isSubscribed) {
          updateUserSubscription(userDetails, isSubscribed);
        });

        /* These examples are all valid */
        OneSignal.isPushNotificationsEnabled().then(function (isEnabled) {
          if (isEnabled) {
            console.log('Push notifications are enabled!');
          } else {
            console.log('Push notifications are not enabled yet.');
          }
        });
      });
    }
  }

  render() {
    return <Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedIn_2_RegisterPush;
