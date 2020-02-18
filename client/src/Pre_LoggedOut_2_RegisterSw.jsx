import React from 'react';
import moment from 'moment';
import { registerServiceWorker } from './registerServiceWorker';

import { getBugsnagClient } from './index';

import Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren from './Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren';

class Pre_LoggedOut_2_RegisterSw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetch = moment();
    this.lastTimeWeRegisteredTheNotification = null;
  }

  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb('componentDidCatch Pre_LoggedOut_2_RegisterSw', {
      debugInfo: info,
    });
    getBugsnagClient().notify(error);
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
        registerServiceWorker().catch(() => console.info('ServiceWorker was not added'));
      }
    }
  }

  render() {
    return <Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren {...this.props} />;
  }
}

export default Pre_LoggedOut_2_RegisterSw;
