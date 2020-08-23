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
    const { setAppViewUIToRequester, setAppViewUIToTasker } = this.props;

    window.OneSignal.push(function () {
      if (!OneSignal._initCalled) {
        OneSignal.push(function () {
          OneSignal.init({
            appId: 'eb135371-9993-4bff-97e6-aad1eff58f9f',
            // process.env.NODE_ENV === 'production'
            //   ? process.env.REACT_APP_ONESIGNAL_PUBLIC
            //   : process.env.REACT_APP_ONESIGNAL_PUBLIC_TEST,
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
    });

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
