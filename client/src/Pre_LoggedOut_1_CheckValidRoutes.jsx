import React from 'react';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { getBugsnagClient } from './index';

import Pre_LoggedOut_2_RegisterSw from './Pre_LoggedOut_2_RegisterSw';

const loggedOutRoutes = [
  '/BidOrBoo',
  '/terms-of-service',
  '/reset-password',
  '/user-profile',
  '/bdb-request/root',
  '/bdb-request/create-request',
  '/bdb-bidder/root',
  '/bdb-bidder/bid-on-request',
];

class Pre_LoggedOut_1_CheckValidRoutes extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb('componentDidCatch Pre_LoggedOut_1_CheckValidRoutes', {
      debugInfo: info,
    });
    getBugsnagClient().notify(error);
  }

  render() {
    // if you are on one of our logged out experience roots , just show it
    const currentPath = this.props.location.pathname;
    const isAllowedRoute = loggedOutRoutes.some((route) => currentPath.includes(route));
    if (isAllowedRoute || currentPath === '/' || /(\/\?).*/.test(currentPath)) {
      return <Pre_LoggedOut_2_RegisterSw {...this.props} />;
    }

    // if you are on the loging in page
    if (this.props.location.pathname.includes(ROUTES.CLIENT.LOGIN_OR_REGISTER)) {
      return <div>{this.props.children}</div>;
    }

    // you are trying to hit a logged in protected route
    return switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
      isLoggedIn: false,
    });
  }
}

export default Pre_LoggedOut_1_CheckValidRoutes;
