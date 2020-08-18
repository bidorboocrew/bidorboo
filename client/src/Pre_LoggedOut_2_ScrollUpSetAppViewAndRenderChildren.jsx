import React from 'react';
import { getBugsnagClient } from './index';

var OneSignal = window.OneSignal || [];

class Pre_LoggedOut_2_ScrollUpSetAppViewAndRenderChildren extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb(
      'componentDidCatch Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren',
      { debugInfo: info },
    );
    getBugsnagClient().notify(error);
  }

  componentDidMount() {
    OneSignal.push(function () {
      if (!OneSignal._initCalled) {
        console.info('OneSignal._initCalled');
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
      }
      // process.env.NODE_ENV !== 'production' &&
      OneSignal.log.setLevel('trace');
      OneSignal.setDefaultNotificationUrl('https://www.bidorboo.ca');
      OneSignal.showSlidedownPrompt();
      /* These examples are all valid */
      OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (isEnabled) {
          console.log('Push notifications are enabled!');
        } else {
          console.log('Push notifications are not enabled yet.');
        }
      });
    });

    const { setAppViewUIToRequester, setAppViewUIToTasker } = this.props;
    const currentUrlPathname = window.location.pathname;

    if (currentUrlPathname.indexOf('bdb-request') > -1) {
      setAppViewUIToRequester();
    } else if (currentUrlPathname.indexOf('bdb-bidder') > -1) {
      setAppViewUIToTasker();
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

  render() {
    return this.props.children;
  }
}

export default Pre_LoggedOut_2_ScrollUpSetAppViewAndRenderChildren;
