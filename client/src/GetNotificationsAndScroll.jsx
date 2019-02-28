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
import { registerServiceWorker, unregister } from './registerServiceWorker';

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

  componentDidUpdate(prevProp) {
    if (this.props.isLoggedIn && (prevProp.isLoggedIn !== this.props.isLoggedIn)) {
      // registerServiceWorker(`${process.env.REACT_APP_VAPID_KEY}`);
      unregister()
    } else if(!this.props.isLoggedIn) {
      this.props.a_getCurrentUser();
    }
  }
  componentDidMount() {
    if(!this.props.isLoggedIn) {
      this.props.a_getCurrentUser();
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
