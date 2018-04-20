import React from 'react';
import PropTypes from 'prop-types';

import BidOrBooGenericTasks from './BidOrBooGenericTasks';
// import Stepper from 'react-stepper-horizontal';
import Rotate from 'react-reveal/Rotate';
import Fade from 'react-reveal/Fade';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoginDialog } from '../app-state/actions/uiActions';

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
    return (
      <div id="bdb-home-content">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <Rotate delay={500} top left cascade>
                <h1 style={{ color: 'white' }} className="title">
                  BidOrBoo
                </h1>
                <h2 style={{ color: 'white' }} className="subtitle">
                  Get tasks done for the price you want. Earn money doing what
                  you love.
                </h2>
              </Rotate>
            </div>
          </div>
        </section>

        <section className="section mainSectionContainer">
          <Fade left delay={1000}>
            <div className="container">
              <section className="hero is-dark is-small is-marginless">
                <div
                  style={{ backgroundColor: '#e98969' }}
                  className="hero-body"
                >
                  <div className="container">
                    <h1 className="title">Post a Job</h1>
                    <h2 className="subtitle">
                      get the work done for the best price possible
                    </h2>
                  </div>
                </div>
              </section>
              {/* <div>
              <Stepper
                size={27}
                activeColor={'rgb(0, 209, 178)'}
                steps={[
                  { title: 'Pick a Template' },
                  { title: 'Fill In Details' },
                  { title: 'Post it!' }
                ]}
                activeStep={0}
              />
            </div> */}
              <div style={{ marginTop: '0.45rem' }}>
                <div className="columns">
                    <BidOrBooGenericTasks />
                </div>
              </div>
            </div>
          </Fade>
        </section>

        <section className="section mainSectionContainer">
          <Fade right delay={1500}>
            <div className="container">
              <section
                style={{ margin: '0.25rem' }}
                className="hero is-dark is-small is-marginless"
              >
                <div
                  style={{ backgroundColor: '#c786f8' }}
                  className="hero-body"
                >
                  <div className="container">
                    <h1 className="title">Bid on a Job</h1>
                    <h2 className="subtitle">
                      Start Earning money by doing things you are good at
                    </h2>
                  </div>
                </div>
              </section>
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

        {/* <div className="container">
            <div className="has-text-centered title">Bid On a Job</div>
            <div className="has-text-centered">
              this section is under development
            </div> */}

        {/* <div>
              <Stepper
                size={24}
                activeColor={'rgb(0, 209, 178)'}
                steps={[
                  { title: 'Select a Job' },
                  { title: 'Bid' },
                  { title: 'Post it!' }
                ]}
                activeStep={0}
              />
            </div> */}
        {/* <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">still under development</div>
            </div> */}
        {/* </div> */}
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
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
