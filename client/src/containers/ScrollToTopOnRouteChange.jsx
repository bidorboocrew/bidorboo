import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser } from '../app-state/actions/authActions';

class ScrollToTopOnRouteChange extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.a_getCurrentUser();
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(ScrollToTopOnRouteChange),
);
