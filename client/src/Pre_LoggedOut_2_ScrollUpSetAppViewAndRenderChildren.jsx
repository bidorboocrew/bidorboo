import React from 'react';
import { getBugsnagClient } from './index';
var OneSignal = OneSignal || [];

class Pre_LoggedOut_2_ScrollUpSetAppViewAndRenderChildren extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb(
      'componentDidCatch Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren',
      { debugInfo: info },
    );
    getBugsnagClient().notify(error);
  }

  componentDidUpdate() {
    if (!OneSignal._initCalled) {
      console.log('initialize one signal callInit');
      OneSignal.push(function() {
        OneSignal.init({
          appId:
            process.env.NODE_ENV === 'production'
              ? process.env.REACT_APP_ONESIGNAL_PUBLIC
              : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
          autoResubscribe: true,
          requiresUserPrivacyConsent: false,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'production' ? false : true,
          promptOptions: {
            slidedown: {
              // https://documentation.onesignal.com/docs/slide-prompt
              enabled: true,
              autoPrompt: true,
              timeDelay: 10,
              pageViews: 1,
              actionMessage: 'Get notified about Requests and Bids in your area',
              /* acceptButtonText limited to 15 characters */
              acceptButtonText: 'YES',
              /* cancelButtonText limited to 15 characters */
              cancelButtonText: 'NO',
            },
            /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
            /* actionMessage limited to 90 characters */
            actionMessage: 'Get notified about Requests and Bids in your area',
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
  }

  componentDidMount() {
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
