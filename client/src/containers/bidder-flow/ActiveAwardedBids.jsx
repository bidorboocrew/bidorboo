import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { showLoginDialog } from '../../app-state/actions/uiActions';

class ProposerRoot extends React.Component {
  componentDidMount() {
    // const { a_showLoginDialog, match } = this.props;
    // const shouldShowLoginDialog = match.params.showLoginDialog;
    // if (shouldShowLoginDialog === 'true') {
    //   a_showLoginDialog(true);
    // }
  }

  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;
    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#F0A6CA' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Bids you won ( under implementation )
              </h1>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div>Awarded Bids List</div>
          </div>
          <div>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.reviewJobPage);
              }}
              className="button is-large"
            >
              <span>Review job</span>
            </a>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ authReducer }) => {
  return {
    isLoggedIn: authReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposerRoot);
