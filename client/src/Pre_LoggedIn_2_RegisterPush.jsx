import React from 'react';
import axios from 'axios';

import { getBugsnagClient } from './index';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

const updateUserSubscription = (userDetails) => {
  console.log('updateUserSubscription');
  try {
    if (!window.OneSignal) {
      return;
    }

    // https://documentation.onesignal.com/docs/web-push-sdk#notificationpermissionchange
    window.OneSignal.push(function () {
      console.log('window.OneSignal.push updateUserSubscription');
      /* These examples are all valid */
      window.OneSignal.getUserId(function (oneSignalUserId) {
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

    updateUserSubscription(userDetails);
    // https://documentation.onesignal.com/docs/sdk-reference
    window.OneSignal.push(function () {
      // OneSignal.showNativePrompt();
      window.OneSignal.setLocationShared && window.OneSignal.setLocationShared(false);
      window.OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
      window.OneSignal.setExternalUserId(userDetails.userId);
      if (userDetails.email && userDetails.email.emailAddress) {
        window.OneSignal.setEmail(userDetails.email.emailAddress);
      }
      window.OneSignal.sendTags({ ...userDetails });

      window.OneSignal.on('subscriptionChange', function (isSubscribed) {
        updateUserSubscription(userDetails);
      });

      window.OneSignal.showSlidedownPrompt();
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
