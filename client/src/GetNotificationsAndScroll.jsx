import { withRouter } from 'react-router-dom';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser } from './app-state/actions/authActions';
import { registerServiceWorker } from './registerServiceWorker';
import { registerPushNotification } from './registerPushNotification';

import {
  setAppViewUIToRequester,
  setAppViewUIToTasker,
  setServerAppRequesterView,
  setServerAppTaskerView,
} from './app-state/actions/uiActions';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { Spinner } from './components/Spinner';
import { Header } from './containers/index';

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

class GetNotificationsAndScroll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetch = moment();
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.error('bdb error details ' + error);
    console.error('failure info ' + info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    const {
      isLoggedIn,
      getCurrentUser,
      location,
      setServerAppRequesterView,
      setServerAppTaskerView,
      authIsInProgress,
      userDetails,
    } = this.props;
    if (authIsInProgress || location.pathname === prevProps.location.pathname) {
      return;
    }
    if (
      prevProps.authIsInProgress &&
      !authIsInProgress &&
      isLoggedIn &&
      userDetails.notifications &&
      userDetails.notifications.push
    ) {
      registerServiceWorker()
        .then(({ registration }) => {
          registerPushNotification(`${process.env.REACT_APP_VAPID_KEY}`, registration)
            .then(() => console.log('push Notifications enabled'))
            .catch((e) => console.log('push Notifications not enabled ' + e));
        })
        .catch(() => console.info('ServiceWorker was not added'));
    }

    const currentUrlPathname = window.location.pathname;

    if (location.pathname !== prevProps.location.pathname && !authIsInProgress) {
      getCurrentUser();

      if (isLoggedIn) {
        if (currentUrlPathname.indexOf('bdb-request') > -1) {
          setServerAppRequesterView();
        } else if (currentUrlPathname.indexOf('bdb-bidder') > -1) {
          setServerAppTaskerView();
        }
      }

      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }

  componentDidMount() {
    this.props.getCurrentUser();
  }

  render() {
    const { authIsInProgress, isLoggedIn, userDetails, history } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id="bidorboo-root-view">
          <Header id="bidorboo-header" />
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <label className="subtitle has-text-info">Sorry! We've encountered an error</label>

                <br />
                <label className="is-size-7">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </label>

                <br />
                <br />
                <a
                  onClick={(e) => {
                    switchRoute(ROUTES.CLIENT.HOME);
                    // xxxx update without reload
                  }}
                  className="button is-success is-medium"
                >
                  Go to Home Page
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }

    // if (authIsInProgress) {
    //   return <Spinner isLoading renderLabel="securing your connection..." />;
    // }

    if (!isLoggedIn) {
      // if you are on one of our logged out experience roots , just show it

      const currentPath = this.props.location.pathname;
      const isAllowedRoute = loggedOutRoutes.some((route) => currentPath.includes(route));
      if (isAllowedRoute || currentPath === '/' || /([\/?]).*/.test(currentPath)) {
        return this.props.children;
      }

      // if you are on the loging in page
      if (this.props.location.pathname.includes(ROUTES.CLIENT.LOGIN_OR_REGISTER)) {
        return this.props.children;
      }

      // you are trying to hit a logged in protected route
      return switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
        isLoggedIn,
      });
    }

    if (
      userDetails.membershipStatus === 'NEW_MEMBER' &&
      history.location.pathname !== ROUTES.CLIENT.TOS &&
      history.location.pathname !== ROUTES.CLIENT.ONBOARDING
    ) {
      return switchRoute(ROUTES.CLIENT.ONBOARDING, { redirectUrl: this.props.location.pathname });
    } else {
      return this.props.children;
    }
  }
}
const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
    authIsInProgress: uiReducer.authIsInProgress,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    // getCurrentUserNotifications: bindActionCreators(getCurrentUserNotifications, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    setAppViewUIToTasker: bindActionCreators(setAppViewUIToTasker, dispatch),
    setAppViewUIToRequester: bindActionCreators(setAppViewUIToRequester, dispatch),
    setServerAppRequesterView: bindActionCreators(setServerAppRequesterView, dispatch),
    setServerAppTaskerView: bindActionCreators(setServerAppTaskerView, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GetNotificationsAndScroll));
