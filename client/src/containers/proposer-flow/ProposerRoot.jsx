import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BidOrBooGenericTasks from '../../components/BidOrBooGenericTasks';

import { showLoginDialog } from '../../app-state/actions/uiActions';

class ProposerRoot extends React.Component {
  componentDidMount() {
    const { a_showLoginDialog, match } = this.props;
    const shouldShowLoginDialog = match.params.showLoginDialog;
    if (shouldShowLoginDialog === 'true') {
      a_showLoginDialog(true);
    }
  }

  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;
    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Post Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get the work done for the best price possible.
              </h2>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div
              // style={{alignItems:'flex-end'}}
              className="columns is-multiline"
            >
              <BidOrBooGenericTasks
                showLoginDialog={a_showLoginDialog}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ authReducer }) => {
  return {
    isLoggedIn: authReducer.isLoggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposerRoot);
