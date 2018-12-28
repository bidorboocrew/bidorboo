import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Reveal from 'react-reveal/Reveal';

import ServiceTemplates from './components/ServiceTemplates';

import { showLoginDialog } from '../../app-state/actions/uiActions';

class ProposerRoot extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn, isForMainPage = false } = this.props;

    return (
      <React.Fragment>
        {!isForMainPage && (
          <section className="hero is-small is-dark has-text-centered">
            <div className="hero-body">
              <div>
                <h1 style={{ color: 'white' }} className="title">
                  Request A Service
                </h1>
              </div>
            </div>
          </section>
        )}
        <section className="section">
          <div className="container">
            <Reveal delay={350} effect="swing-in-top-fwd">
              <ServiceTemplates showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
            </Reveal>
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
