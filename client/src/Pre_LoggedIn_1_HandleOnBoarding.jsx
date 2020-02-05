import React from 'react';

import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';

import Pre_LoggedIn_2_RegisterSwAndPush from './Pre_LoggedIn_2_RegisterSwAndPush';

class Pre_LoggedIn_1_HandleOnBoarding extends React.PureComponent {
  render() {
    const { userDetails, history } = this.props;

    if (
      userDetails.membershipStatus === 'NEW_MEMBER' &&
      history.location.pathname !== ROUTES.CLIENT.TOS &&
      history.location.pathname !== ROUTES.CLIENT.ONBOARDING
    ) {
      return switchRoute(ROUTES.CLIENT.ONBOARDING, { redirectUrl: this.props.location.pathname });
    } else if (this.props.location.pathname.includes(ROUTES.CLIENT.LOGIN_OR_REGISTER)) {
      return switchRoute(ROUTES.CLIENT.HOME);
    } else {
      return <Pre_LoggedIn_2_RegisterSwAndPush {...this.props} />;
    }
  }
}

export default Pre_LoggedIn_1_HandleOnBoarding;
