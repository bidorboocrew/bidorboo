import { withRouter } from 'react-router-dom';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';
import {
  setAppViewUIToProposer,
  setAppViewUIToTasker,
  setServerAppProposerView,
  setServerAppTaskerView,
} from './app-state/actions/uiActions';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { Spinner } from './components/Spinner';
import { Header } from './containers/index';

const loggedOutRoutes = [
  ROUTES.CLIENT.HOME,
  ROUTES.CLIENT.TOS,
  ROUTES.CLIENT.RESETPASSWORD,
  ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW,
  ROUTES.CLIENT.REQUESTER.root,
  ROUTES.CLIENT.TASKER.root,
  ROUTES.CLIENT.TASKER.bidOnJobPage,
];

class GetNotificationsAndScroll extends React.Component {
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
      setServerAppProposerView,
      setServerAppTaskerView,
    } = this.props;
    const currentUrlPathname = window.location.pathname;
    if (currentUrlPathname.indexOf('my-profile/basic-settings') > 0) {
      document.querySelector('body').setAttribute('style', 'background:white');
    } else {
      document.querySelector('body').setAttribute('style', 'background:#eeeeee');
    }
    if (currentUrlPathname.indexOf('termsAndPrivacy') > -1) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      return;
    }
    if (location.pathname !== prevProps.location.pathname) {
      if (isLoggedIn !== prevProps.isLoggedIn && !isLoggedIn) {
        getCurrentUser();
      }

      if (isLoggedIn) {
        if (currentUrlPathname.indexOf('on-boarding') > -1) {
          // do not fetch notifications on these pages above
        } else {
          this.props.getCurrentUserNotifications();
        }

        if (currentUrlPathname.indexOf('bdb-request') > -1) {
          setServerAppProposerView();
        } else if (currentUrlPathname.indexOf('bdb-offer') > -1) {
          setServerAppTaskerView();
        }
      }

      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }

  // componentDidCatch() {
  //   // clearTimeout(this.fetchUserAndNotificationUpdated);
  // }

  // componentWillUnmount() {
  //   // clearTimeout(this.fetchUserAndNotificationUpdated);
  // }

  componentDidMount() {
    const {
      getCurrentUser,
      setAppViewUIToTasker,
      setAppViewUIToProposer,
      isLoggedIn,
      userDetails,
    } = this.props;

    if (isLoggedIn) {
      if (userDetails.appView === 'REQUESTER') {
        setAppViewUIToProposer();
      } else if (userDetails.appView === 'TASKER') {
        setAppViewUIToTasker();
      }
    } else {
      getCurrentUser();
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
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

    if (authIsInProgress) {
      return <Spinner renderLabel="securing your connection" />;
    }
    if (!isLoggedIn) {
      if (loggedOutRoutes.indexOf(this.props.location.pathname) > -1) {
        return this.props.children;
      } else {
        if (this.props.location.pathname !== ROUTES.CLIENT.LOGIN_OR_REGISTER) {
          return switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
            isLoggedIn,
            redirectedFromUrl: this.props.location.pathname,
          });
        }

        return this.props.children;
      }
    } else {
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
    getCurrentUserNotifications: bindActionCreators(getCurrentUserNotifications, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    setAppViewUIToTasker: bindActionCreators(setAppViewUIToTasker, dispatch),
    setAppViewUIToProposer: bindActionCreators(setAppViewUIToProposer, dispatch),
    setServerAppProposerView: bindActionCreators(setServerAppProposerView, dispatch),
    setServerAppTaskerView: bindActionCreators(setServerAppTaskerView, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GetNotificationsAndScroll));
