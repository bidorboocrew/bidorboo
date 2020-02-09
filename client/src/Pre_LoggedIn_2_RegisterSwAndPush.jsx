import React from 'react';
import moment from 'moment';
import { registerServiceWorker } from './registerServiceWorker';
import { registerPushNotification } from './registerPushNotification';

import Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren from './Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren';

class Pre_LoggedIn_2_RegisterSwAndPush extends React.PureComponent {
  componentDidMount() {
    const { userDetails } = this.props;
    if (userDetails.notifications && userDetails.notifications.push) {
      const lastKnownRegTimeStamp = window.sessionStorage.getItem(
        'bob-SWPushRegTimestamp',
        moment().toISOString(),
      );

      if (
        !lastKnownRegTimeStamp ||
        moment(lastKnownRegTimeStamp).isBefore(moment().subtract(1, 'day'))
      ) {
        window.sessionStorage.setItem('bob-SWPushRegTimestamp', moment().toISOString());

        this.lastTimeWeRegisteredTheNotification = moment().toISOString();
        registerServiceWorker()
          .then(({ registration }) => {
            registerPushNotification(`${process.env.REACT_APP_VAPID_KEY}`, registration)
              .then(() => console.log('push Notifications enabled'))
              .catch((e) => console.log('push Notifications not enabled ' + e));
          })
          .catch(() => console.info('ServiceWorker was not added'));
      }
    }
  }

  render() {
    return <Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedIn_2_RegisterSwAndPush;
