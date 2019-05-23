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

import { Header } from './containers/index';
// const EVERY_30_SECS = 900000; //MS
// const EVERY_15_MINUTES = 900000; //MS
// const UPDATE_NOTIFICATION_INTERVAL =
//   process.env.NODE_ENV === 'production' ? EVERY_15_MINUTES : EVERY_30_SECS;

class GetNotificationsAndScroll extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.fetchUserAndNotificationUpdated = () => {
  //     if (this.props.isLoggedIn) {
  //       this.props.getCurrentUserNotifications();
  //     }

  //     setTimeout(() => {
  //       this.fetchUserAndNotificationUpdated();
  //     }, UPDATE_NOTIFICATION_INTERVAL);
  //   };
  // }
  constructor(props) {
    super(props);
    this.lastFetch = moment();

    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
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
      setServerAppBidderView,
    } = this.props;

    if (location !== prevProps.location) {
      if (!isLoggedIn) {
        getCurrentUser();
      }
      const currentUrlPathname = window.location.pathname;
      if (isLoggedIn) {
        if (
          currentUrlPathname.indexOf('user-profile') > -1 ||
          currentUrlPathname.indexOf('verification') > -1 ||
          currentUrlPathname.indexOf('bdb-request') > -1 ||
          currentUrlPathname.indexOf('bdb-offer') > -1 ||
          currentUrlPathname.indexOf('/review') > -1 ||
          currentUrlPathname.indexOf('my-profile') > -1 ||
          currentUrlPathname.indexOf('my-agenda') > -1 ||
          currentUrlPathname.indexOf('on-boarding') > -1
        ) {
          // do not fetch notifications on these pages above
        } else {
          if (moment().diff(this.lastFetch, 'minutes') > 3) {
            this.lastFetch = moment();
            // this.props.getCurrentUserNotifications();
          }
        }

        if (currentUrlPathname.indexOf('bdb-request') > -1) {
          setServerAppProposerView();
        } else if (currentUrlPathname.indexOf('bdb-offer') > -1) {
          setServerAppBidderView();
        }
      }
      setTimeout(() => window.scrollTo(0, 0), 0);
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
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id="bidorboo-root-view">
          <Header id="bidorboo-header" />
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <h1 className="title has-text-danger">OOOOPS ! We've Encountered An Error</h1>
                <br />
                <h1 className="sub-title">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </h1>
                <br />
                <a
                  onClick={(e) => {
                    switchRoute(ROUTES.CLIENT.HOME);
                    window.location.reload();
                  }}
                  className="button is-outlined is-success is-small"
                >
                  Go to Home Page
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }
    return this.props.children;
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GetNotificationsAndScroll),
);
