import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ServiceTemplates from './components/ServiceTemplates';

import { showLoginDialog } from '../../app-state/actions/uiActions';

class ProposerRoot extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;

    return (
      <React.Fragment>
        <section className="hero is-small is-dark has-text-centered">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                Request A Service
              </h1>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <ServiceTemplates showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      </React.Fragment>
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
