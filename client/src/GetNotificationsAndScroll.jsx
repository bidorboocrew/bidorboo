import { withRouter } from 'react-router-dom';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';
import {
  setAppViewUIToProposer,
  setAppViewUIToBidder,
  setServerAppProposerView,
  setServerAppBidderView,
} from './app-state/actions/uiActions';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { Spinner } from './components/Spinner';
// import LoginOrRegisterPage from './containers/onboarding-flow/LoginOrRegisterPage.jsx';
import { Header } from './containers/index';
// const EVERY_30_SECS = 900000; //MS
// const EVERY_15_MINUTES = 900000; //MS
// const UPDATE_NOTIFICATION_INTERVAL =
//   process.env.NODE_ENV === 'production' ? EVERY_15_MINUTES : EVERY_30_SECS;

const loggedOutRoutes = [
  ROUTES.CLIENT.HOME,
  ROUTES.CLIENT.TOS,
  ROUTES.CLIENT.RESETPASSWORD,
  ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW,
  ROUTES.CLIENT.PROPOSER.root,
  ROUTES.CLIENT.BIDDER.root,
  ROUTES.CLIENT.BIDDER.bidOnJobPage,
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
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.location.pathname !== this.props.location.pathname) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate(prevProps) {
    const {
      isLoggedIn,
      getCurrentUser,
      location,
      setServerAppProposerView,
      setServerAppBidderView,
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
          setServerAppBidderView();
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
      setAppViewUIToBidder,
      setAppViewUIToProposer,
      isLoggedIn,
      userDetails,
    } = this.props;

    if (isLoggedIn) {
      if (userDetails.appView === 'PROPOSER') {
        setAppViewUIToProposer();
      } else if (userDetails.appView === 'BIDDER') {
        setAppViewUIToBidder();
      }
    } else {
      getCurrentUser();
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

  render() {
    const { authIsInProgress, isLoggedIn } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id="bidorboo-root-view">
          <Header id="bidorboo-header" />
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <h1 className="title has-text-info">Sorry! we've encountered an error</h1>
                <br />
                <h1 className="sub-title">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </h1>
                <br />
                <a
                  onClick={(e) => {
                    switchRoute(ROUTES.CLIENT.HOME);
                  }}
                  className="button is-success is-small"
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
    getCurrentUserNotifications: bindActionCreators(getCurrentUserNotifications, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    setAppViewUIToBidder: bindActionCreators(setAppViewUIToBidder, dispatch),
    setAppViewUIToProposer: bindActionCreators(setAppViewUIToProposer, dispatch),
    setServerAppProposerView: bindActionCreators(setServerAppProposerView, dispatch),
    setServerAppBidderView: bindActionCreators(setServerAppBidderView, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GetNotificationsAndScroll));
