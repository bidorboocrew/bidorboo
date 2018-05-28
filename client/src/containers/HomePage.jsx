import React from 'react';
import PropTypes from 'prop-types';

import BidOrBooGenericTasks from '../components/BidOrBooGenericTasks';
import Rotate from 'react-reveal/Rotate';
import Fade from 'react-reveal/Fade';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoginDialog } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

class HomePage extends React.Component {
  static propTypes = {
    a_showLoginDialog: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { s_resolvedLogin, a_showLoginDialog, match } = this.props;
    const shouldShowLoginDialog = match.params.showLoginDialog;
    if (s_resolvedLogin && shouldShowLoginDialog) {
      a_showLoginDialog(true);
    }
  }

  render() {
    const { a_switchRoute } = this.props;
    return (
      <div id="bdb-home-content">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <Rotate top left cascade>
                <h1 style={{ color: 'white' }} className="title">
                  BidOrBoo
                </h1>
              </Rotate>
              <h2 style={{ color: 'white' }} className="subtitle slide-in-left">
                Get tasks done for the price you want. Earn money doing what you
                love.
              </h2>
            </div>
          </div>
        </section>

        <section className="mainSectionContainer">
          <Fade left>
            <div className="container">
              {/* <section className="hero is-dark is-small is-marginless is-hidden-mobile">
                <div
                  style={{ backgroundColor: '#e98969' }}
                  className="hero-body"
                >
                  <div className="container">
                    <h1 className="title">Post Jobs</h1>
                    <h2 className="subtitle">
                      Get the work done for the best price possible
                    </h2>
                  </div>
                </div>
              </section> */}
              <div className="card-header-title">Start posting jobs</div>

              <div className="container">
                <div
                  // style={{alignItems:'flex-end'}}
                  className="columns is-multiline"
                >
                  <BidOrBooGenericTasks switchRoute={a_switchRoute} />
                </div>
              </div>
            </div>
          </Fade>
        </section>

        <section className="mainSectionContainer">
          <Fade right>
            <div className="container">
              {/* <section
                style={{ margin: '0.25rem' }}
                className="hero is-dark is-small is-marginless is-hidden-mobile"
              >
                <div
                  style={{ backgroundColor: '#c786f8' }}
                  className="hero-body"
                >
                  <div className="container">
                    <h1 className="title">Bid on Jobs</h1>
                    <h2 className="subtitle">
                      Start Earning money by doing things you are good at.
                    </h2>
                  </div>
                </div>
              </section> */}
              <div className="card-header-title">Start Bidding on jobs</div>

              <div style={{ marginTop: '0.45rem' }}>
                <div className="columns">
                  <div className="column has-text-centered">
                    <p>this is under development</p>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ authReducer }) => {
  return {
    s_resolvedLogin: authReducer.resolvedLogin
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
