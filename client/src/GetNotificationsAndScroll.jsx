import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from './app-state/actions/authActions';
import { updateUserAbilities, ABILITIES_ENUM } from './app-state/Abilities';

class GetNotificationsAndScroll extends React.Component {
  componentDidUpdate(prevProps) {
    const { s_isLoggedIn, a_getCurrentUser, location, a_getCurrentUserNotifications } = this.props;
    if (prevProps.s_isLoggedIn !== s_isLoggedIn && !s_isLoggedIn) {
      updateUserAbilities(ABILITIES_ENUM.loggedOut);
    }
    if (location !== prevProps.location) {
      if (!s_isLoggedIn) {
        a_getCurrentUser();
      }

      if (s_isLoggedIn) {
        a_getCurrentUserNotifications();
      }
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
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
