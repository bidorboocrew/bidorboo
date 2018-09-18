import React from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';

// import BidOrBooGenericTasks from '../components/BidOrBooGenericTasks';
import Rotate from 'react-reveal/Rotate';

import * as ROUTES from '../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoginDialog } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';
// import HomePageMapSection from '../components/HomePageMapSection';
// import { selectJobToBidOn } from '../app-state/actions/bidsActions';
// import { getAllPostedJobs } from '../app-state/actions/jobActions';

const djsConfig = {
  addRemoveLinks: true,
  acceptedFiles: "image/jpeg,image/png,image/gif"
};

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/uploadHandler'   // route url to upload file over server
};
const eventHandlers = {
  init: dz => this.dropzone = dz,
  drop: this.callbackArray,
  addedfile: this.callback,
  success: this.success,
  removedfile: this.removedfile,
  uploadprogress: this.progress
}
class Basic extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  render() {
    return (
      <section>
       <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} />

      </section>
    );
  }
}
class HomePage extends React.Component {
  static propTypes = {
    a_showLoginDialog: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      a_switchRoute
      // a_selectJobToBidOn,
      // s_mapCenterPoint,
      // s_allThePostedJobsList
    } = this.props;
    return (
      <div id="bdb-home-content">
      <Basic></Basic>
        <section className="hero is-dark fade-in">
          <div className="hero-body">
            <div className="container">
              <Rotate delay={300} top left cascade>
                <h1 style={{ color: 'white' }} className="title">
                  BidOrBoo
                </h1>
              </Rotate>
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
                      a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
                    }}
                    className="card fade-in"
                  >
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <img
                          src="https://www.auto-schnitter.de/wp-content/uploads/2015/10/DIFF-HAPPY-JOBS-940.png"
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
                          a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
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
                      a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
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
                          a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
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
    // a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
    // a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch)
  };
};
export default connect(
  null,
  mapDispatchToProps
)(HomePage);
