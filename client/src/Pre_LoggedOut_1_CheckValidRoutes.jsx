import React from 'react';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';

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
  render() {
    // if you are on one of our logged out experience roots , just show it
    const currentPath = this.props.location.pathname;
    const isAllowedRoute = loggedOutRoutes.some((route) => currentPath.includes(route));
    if (isAllowedRoute || currentPath === '/' || /(\/\?).*/.test(currentPath)) {
      return <Pre_LoggedOut_2_RegisterSw {...this.props} />;
    }

    // if you are on the loging in page
    if (this.props.location.pathname.includes(ROUTES.CLIENT.LOGIN_OR_REGISTER)) {
      return this.props.children;
    }

    // you are trying to hit a logged in protected route
    return switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
      isLoggedIn: false,
    });
  }
}

export default Pre_LoggedOut_1_CheckValidRoutes;
