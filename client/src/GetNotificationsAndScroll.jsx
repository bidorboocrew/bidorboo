import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';
import {
  setAppViewUIToProposer,
  setAppViewUIToBidder,
  setServerAppProposerView,
  setServerAppBidderView,
} from './app-state/actions/uiActions';
import { registerServiceWorker } from './registerServiceWorker';

// const EVERY_30_SECS = 900000; //MS
// const EVERY_15_MINUTES = 900000; //MS
// const UPDATE_NOTIFICATION_INTERVAL =
//   process.env.NODE_ENV === 'production' ? EVERY_15_MINUTES : EVERY_30_SECS;

class GetNotificationsAndScroll extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.fetchUserAndNotificationUpdated = () => {
  //     if (this.props.isLoggedIn) {
  //       this.props.a_getCurrentUserNotifications();
  //     }

  //     setTimeout(() => {
  //       this.fetchUserAndNotificationUpdated();
  //     }, UPDATE_NOTIFICATION_INTERVAL);
  //   };
  // }

  componentDidUpdate(prevProps) {
    const {
      isLoggedIn,
      a_getCurrentUser,
      location,
      userDetails,
      a_setServerAppProposerView,
      a_setServerAppBidderView,
      a_setAppViewUIToBidder,
      a_setAppViewUIToProposer,
    } = this.props;

    if (isLoggedIn) {
      if (userDetails.appView === 'PROPOSER') {
        a_setAppViewUIToProposer();
      } else if (userDetails.appView === 'BIDDER') {
        a_setAppViewUIToBidder();
      }
      if (
        userDetails &&
        userDetails.notifications &&
        userDetails.notifications.push &&
        !userDetails.pushSubscription
      ) {
        // if (process.env.NODE_ENV === 'production') {
        registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`);
        // }
      }
    }

    if (location !== prevProps.location) {
      if (!isLoggedIn) {
        a_getCurrentUser();
      }

      if (isLoggedIn) {
        if (
          location.pathname.indexOf('user-profile') > -1 ||
          location.pathname.indexOf('verification') > -1 ||
          location.pathname.indexOf('bdb-request') > -1 ||
          location.pathname.indexOf('bdb-offer') > -1 ||
          location.pathname.indexOf('/review') > -1 ||
          location.pathname.indexOf('my-profile') > -1 ||
          location.pathname.indexOf('my-agenda') > -1 ||
          location.pathname.indexOf('on-boarding') > -1
        ) {
          // do not fetch notifications on these pages above
        } else {
          this.props.a_getCurrentUserNotifications();
        }

        if (location.pathname.indexOf('bdb-request') > -1) {
          a_setServerAppProposerView();
        } else if (location.pathname.indexOf('bdb-offer') > -1) {
          a_setServerAppBidderView();
        }
      }
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }

  componentDidCatch() {
    // clearTimeout(this.fetchUserAndNotificationUpdated);
  }

  componentWillUnmount() {
    // clearTimeout(this.fetchUserAndNotificationUpdated);
  }

  componentDidMount() {
    const {
      a_getCurrentUser,
      location,
      a_setAppViewUIToBidder,
      a_setAppViewUIToProposer,
      isLoggedIn,
    } = this.props;

    if (isLoggedIn) {
      if (location.pathname.indexOf('bdb-request') > -1) {
        a_setAppViewUIToProposer();
      } else if (location.pathname.indexOf('bdb-offer') > -1) {
        a_setAppViewUIToBidder();
      }
    } else {
      a_getCurrentUser();
    }
  }

  render() {
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
    a_getCurrentUserNotifications: bindActionCreators(getCurrentUserNotifications, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_setAppViewUIToBidder: bindActionCreators(setAppViewUIToBidder, dispatch),
    a_setAppViewUIToProposer: bindActionCreators(setAppViewUIToProposer, dispatch),
    a_setServerAppProposerView: bindActionCreators(setServerAppProposerView, dispatch),
    a_setServerAppBidderView: bindActionCreators(setServerAppBidderView, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GetNotificationsAndScroll),
);
