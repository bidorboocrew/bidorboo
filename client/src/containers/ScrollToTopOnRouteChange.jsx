import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUserNotifications, getCurrentUser } from '../app-state/actions/authActions';

class ScrollToTopOnRouteChange extends React.Component {
  componentDidUpdate(prevProps) {
    if (!this.props.s_isLoggedIn) {
      this.props.a_getCurrentUser();
    }
    if (this.props.location !== prevProps.location) {
      if (this.props.s_isLoggedIn) {
        this.props.a_getCurrentUserNotifications();
      }
      window.scrollTo(0, 0);
    }
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
  )(ScrollToTopOnRouteChange),
);
