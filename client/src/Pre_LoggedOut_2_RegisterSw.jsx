import React from 'react';
import moment from 'moment';
import { registerServiceWorker } from './registerServiceWorker';
import { registerPushNotification } from './registerPushNotification';

import Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren from './Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren';

class Pre_LoggedOut_2_RegisterSw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetch = moment();
    this.lastTimeWeRegisteredTheNotification = null;
  }

  componentDidMount() {
    const { userDetails } = this.props;
    if (userDetails.notifications && userDetails.notifications.push) {
      if (
        !this.lastTimeWeRegisteredTheNotification ||
        moment(this.lastTimeWeRegisteredTheNotification).isBefore(
          moment(this.lastTimeWeRegisteredTheNotification).subtract(1, 'day'),
        )
      ) {
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
    return <Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedOut_2_RegisterSw;
