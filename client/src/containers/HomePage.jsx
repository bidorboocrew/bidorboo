import React from 'react';
import PropTypes from 'prop-types';

// import BidOrBooGenericTasks from '../components/BidOrBooGenericTasks';
// import Rotate from 'react-reveal/Rotate';

import * as ROUTES from '../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoginDialog } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

// import HomePageMapSection from '../components/HomePageMapSection';
// import { selectJobToBidOn } from '../app-state/actions/bidsActions';
// import { getAllPostedJobs } from '../app-state/actions/jobActions';

class HomePage extends React.Component {
  static propTypes = {
    a_showLoginDialog: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      a_switchRoute,
    } = this.props;
    return (
      <div id="bdb-home-content">
        <section className="hero is-dark fade-in">
          <div className="hero-body">
            <div className="container">
              {/* <Rotate delay={300} top left cascade> */}
              <h1 style={{ color: 'white' }} className="title">
                BidOrBoo
              </h1>
              {/* </Rotate> */}
              <h2 style={{ color: 'white' }} className="subtitle fade-in">
                Get tasks done for the price you want. Earn money doing what you
                love.
              </h2>
            </div>
          </div>
        </section>
        <div>
          <section className="mainSectionContainer">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <div
                    onClick={() => {
                      a_switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    }}
                    className="card fade-in"
                  >
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <img
                          src="https://images.theconversation.com/files/191713/original/file-20171024-30561-ph2byj.jpg?ixlib=rb-1.1.0&rect=665%2C0%2C2622%2C1744&q=45&auto=format&w=1012&h=668&fit=crop"
                          alt="Placeholder image"
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <div className="content">
                        <p className="title">Post Your Jobs</p>
                        <p className="subtitle">
                          Start with one of our templates and post your jobs.
                          Get your chores done for a price that will please you.
                        </p>
                      </div>
                    </div>
                    <footer className="card-footer">
                      <a
                        onClick={() => {
                          a_switchRoute(ROUTES.CLIENT.PROPOSER.root);
                        }}
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#e98969'
                        }}
                        className="card-footer-item button is-primary is-large"
                      >
                        <span style={{ marginLeft: 4 }}>
                          <i className="fa fa-plus fa-w-14" /> Start Posting
                          Jobs
                        </span>
                      </a>
                    </footer>
                  </div>
                </div>
                <div className="column">
                  <div
                    onClick={() => {
                      a_switchRoute(ROUTES.CLIENT.BIDDER.root);
                    }}
                    className="card fade-in"
                  >
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <img
                          src="https://martechtoday.com/wp-content/uploads/2018/04/header-bidding-auction-ss-1920-800x450.gif"
                          alt="Placeholder image"
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <div className="content">
                        <p className="title">Bid On Jobs</p>
                        <p className="subtitle">
                          Start Bidding on the jobs. Do the work you like for
                          the price you like. Be your own boss and manage your
                          own schedule.
                        </p>
                      </div>
                    </div>
                    <footer className="card-footer">
                      <a
                        onClick={() => {
                          a_switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#c786f8'
                        }}
                        className="card-footer-item button is-primary is-large"
                      >
                        <span style={{ marginLeft: 4 }}>
                          <i className="fas fa-dollar-sign" /> Start Bidding Now
                        </span>
                      </a>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(HomePage);
