import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ServiceTemplates from './components/ServiceTemplates';

import { showLoginDialog } from '../../app-state/actions/uiActions';

class ProposerRoot extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;

    return (
      <div className="container is-widescreen bidorbooAddTopMargin">
        <ServiceTemplates showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposerRoot);
