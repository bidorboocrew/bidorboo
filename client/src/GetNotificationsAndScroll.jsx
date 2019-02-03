import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';

const EVERY_30_SECS = 30000; //MS
const EVERY_15_MINUTES = 900000; //MS
const UPDATE_NOTIFICATION_INTERVAL =
  process.env.NODE_ENV === 'production' ? EVERY_15_MINUTES : EVERY_30_SECS;

class GetNotificationsAndScroll extends React.Component {
  constructor(props) {
    super(props);

    this.fetchUserAndNotificationUpdated = () => {
      if (this.props.s_isLoggedIn) {
        this.props.a_getCurrentUserNotifications();
      }

      setTimeout(() => {
        this.fetchUserAndNotificationUpdated();
      }, UPDATE_NOTIFICATION_INTERVAL);
    };
  }

  componentDidUpdate(prevProps) {
    const { s_isLoggedIn, a_getCurrentUser, location } = this.props;

    if (location !== prevProps.location) {
      if (!s_isLoggedIn) {
        a_getCurrentUser();

        setTimeout(() => {
          this.fetchUserAndNotificationUpdated();
        }, UPDATE_NOTIFICATION_INTERVAL);
      }

      // if (s_isLoggedIn) {
      //   a_getCurrentUserNotifications();
      // }
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }

  componentDidCatch() {
    clearTimeout(this.fetchUserAndNotificationUpdated);
  }

  componentWillUnmount() {
    clearTimeout(this.fetchUserAndNotificationUpdated);
  }

  componentDidMount() {
    this.props.a_getCurrentUser();
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
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GetNotificationsAndScroll),
  null,
);
