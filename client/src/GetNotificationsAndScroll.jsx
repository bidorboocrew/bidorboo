import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';
import { setAppBidderView, setAppProposerView } from './app-state/actions/uiActions';

// const EVERY_30_SECS = 900000; //MS
// const EVERY_15_MINUTES = 900000; //MS
// const UPDATE_NOTIFICATION_INTERVAL =
//   process.env.NODE_ENV === 'production' ? EVERY_15_MINUTES : EVERY_30_SECS;

class GetNotificationsAndScroll extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.fetchUserAndNotificationUpdated = () => {
  //     if (this.props.s_isLoggedIn) {
  //       this.props.a_getCurrentUserNotifications();
  //     }

  //     setTimeout(() => {
  //       this.fetchUserAndNotificationUpdated();
  //     }, UPDATE_NOTIFICATION_INTERVAL);
  //   };
  // }

  componentDidUpdate(prevProps) {
    const {
      s_isLoggedIn,
      a_getCurrentUser,
      location,
      a_setAppBidderView,
      a_setAppProposerView,
    } = this.props;

    if (location !== prevProps.location) {
      if (!s_isLoggedIn) {
        a_getCurrentUser();
      }
      if (s_isLoggedIn) {
        if (
          location.pathname.indexOf('user-profile') > -1 ||
          location.pathname.indexOf('verification') > -1 ||
          location.pathname.indexOf('bdb-request') > -1 ||
          location.pathname.indexOf('bdb-offer') > -1 ||
          location.pathname.indexOf('/review') > -1 ||
          location.pathname.indexOf('/my-profile') > -1
        ) {
          // do not fetch notifications on these pages above
        } else {
          this.props.a_getCurrentUserNotifications();
        }

        if (location.pathname.indexOf('bdb-request') > -1) {
          a_setAppProposerView();
        } else if (location.pathname.indexOf('bdb-offer') > -1) {
          a_setAppBidderView();
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
      a_setAppBidderView,
      a_setAppProposerView,
      s_isLoggedIn,
    } = this.props;
    a_getCurrentUser();
    if (s_isLoggedIn) {
      if (location.pathname.indexOf('bdb-request') > -1) {
        a_setAppProposerView();
      } else if (location.pathname.indexOf('bdb-offer') > -1) {
        a_setAppBidderView();
      }
    }
    // setTimeout(() => {
    //   this.fetchUserAndNotificationUpdated();
    // }, UPDATE_NOTIFICATION_INTERVAL);
  }

  render() {
    return this.props.children;
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    s_isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getCurrentUserNotifications: bindActionCreators(getCurrentUserNotifications, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_setAppBidderView: bindActionCreators(setAppBidderView, dispatch),
    a_setAppProposerView: bindActionCreators(setAppProposerView, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GetNotificationsAndScroll),
);
