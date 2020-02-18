import React from 'react';
import axios from 'axios';
import { registerServiceWorker } from './registerServiceWorker';

import { getBugsnagClient } from './index';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

class Pre_LoggedIn_2_RegisterSwAndPush extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb('componentDidCatch Pre_LoggedIn_2_RegisterSwAndPush', {
      debugInfo: info,
    });
    getBugsnagClient().notify(error);
  }

  componentDidMount() {
    const { userDetails } = this.props;
    registerServiceWorker();
    if (userDetails.notifications && userDetails.notifications.push) {
      // https://documentation.onesignal.com/docs/sdk-reference
      var OneSignal = window.OneSignal || [];

      OneSignal.push(async () => {
        let externalUserId = '';
        if (OneSignal) {
          externalUserId = await OneSignal.getExternalUserId();
        }

        if (externalUserId !== userDetails.userId) {
          OneSignal.init({
            appId:
              process.env.NODE_ENV === 'production'
                ? process.env.REACT_APP_ONESIGNAL_PUBLIC
                : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
            autoResubscribe: true,
            notifyButton: {
              enable: true,
            },
            allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
            welcomeNotification: {
              disable: true,
            },
          });
          if (!OneSignal.isPushNotificationsSupported()) {
            return;
          }
          OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
          OneSignal.setExternalUserId(userDetails.userId);
          OneSignal.showSlidedownPrompt();

          const oneSignalUserId = await OneSignal.getUserId();
          if (oneSignalUserId) {
            await axios.post('/api/push/register', {
              data: {
                oneSignalUserId,
              },
            });
          }
        }
      });
    }
  }

  render() {
    return <Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedIn_2_RegisterSwAndPush;
