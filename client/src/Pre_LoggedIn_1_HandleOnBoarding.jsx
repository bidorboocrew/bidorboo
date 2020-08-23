import React from 'react';
import { getBugsnagClient } from './index';

import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import SetupYourPhoneAneEmailVerifications from './containers/onboarding-flow/SetupYourPhoneAneEmailVerifications.jsx';
import Pre_LoggedIn_2_RegisterPush from './Pre_LoggedIn_2_RegisterPush';
import FirstTimeUser from './containers/onboarding-flow/FirstTimeUser.jsx';
class Pre_LoggedIn_1_HandleOnBoarding extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb('componentDidCatch Pre_LoggedIn_1_HandleOnBoarding', {
      debugInfo: info,
    });
    getBugsnagClient().notify(error);
  }

  render() {
    const { userDetails, history } = this.props;

    if (history.location.pathname === ROUTES.CLIENT.TOS) {
      // any of the logged out routes just render right away
      return this.props.children;
    } else if (userDetails.membershipStatus === 'NEW_MEMBER') {
      return <FirstTimeUser></FirstTimeUser>;
    } else if (userDetails && !userDetails.canPost) {
      return (
        <section
          id="bob-requesterVerificationBanner"
          className="hero is-white slide-in-top is-fullheight has-text-centered"
        >
          <div style={{ marginTop: 0 }} className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered">Setting up your BidOrBoo account</h1>
              <h1 className="subtitle has-text-centered">Let's verify your basic info</h1>
              <SetupYourPhoneAneEmailVerifications></SetupYourPhoneAneEmailVerifications>
            </div>
          </div>
        </section>
      );
    } else if (this.props.location.pathname.includes(ROUTES.CLIENT.LOGIN_OR_REGISTER)) {
      return switchRoute(ROUTES.CLIENT.HOME);
    } else {
      return <Pre_LoggedIn_2_RegisterPush {...this.props} />;
    }
  }
}

export default Pre_LoggedIn_1_HandleOnBoarding;
