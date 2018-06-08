import React from 'react';
import PropTypes from 'prop-types';

import BidOrBooGenericTasks from '../components/BidOrBooGenericTasks';
import Rotate from 'react-reveal/Rotate';
import Fade from 'react-reveal/Fade';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showLoginDialog } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';
import BidderMapSection from '../components/BidderMapSection';
import { selectJobToBidOn } from '../app-state/actions/bidsActions';
import { getAllPostedJobs } from '../app-state/actions/jobActions';

class HomePage extends React.Component {
  static propTypes = {
    a_showLoginDialog: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const {
      a_getAllPostedJobs,
      s_resolvedLogin,
      a_showLoginDialog,
      match
    } = this.props;
    const shouldShowLoginDialog = match.params.showLoginDialog;
    if (s_resolvedLogin && shouldShowLoginDialog) {
      a_showLoginDialog(true);
    }
    a_getAllPostedJobs();
  }

  render() {
    const {
      a_switchRoute,
      a_selectJobToBidOn,
      s_mapCenterPoint,
      s_allThePostedJobsList
    } = this.props;
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
              <div className="has-text-centered">
                <div className="card-header-title has-text-grey-dark is-title">
                  <i
                    style={{ marginRight: 4 }}
                    className="fa fa-plus fa-w-14"
                  />
                  <span> Start posting jobs</span>
                </div>
              </div>
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
          <div className="container">
            <div className="has-text-centered">
              <div className="card-header-title has-text-grey-dark is-title">
                <i style={{ marginRight: 4 }} className="fas fa-hand-paper" />
                <span> Start Bidding on jobs</span>
              </div>
            </div>
            <BidderMapSection
              selectJobToBidOn={a_selectJobToBidOn}
              mapCenterPoint={s_mapCenterPoint}
              jobsList={s_allThePostedJobsList}
            />
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ authReducer, jobsReducer }) => {
  return {
    s_resolvedLogin: authReducer.resolvedLogin,
    s_mapCenterPoint: jobsReducer.mapCenterPoint,
    s_allThePostedJobsList: jobsReducer.allThePostedJobsList
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch)
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
