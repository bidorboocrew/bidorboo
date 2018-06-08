import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../app-state/actions/routerActions';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { AddJobWithDetailsCard } from '../components/AddJobWithDetailsCard';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import { routerActions } from 'react-router-redux';
import { addJob } from '../app-state/actions/jobActions';
class ProposerCurrentAddedJob extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const { a_switchRoute } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.myjobs);
                  }}
                >
                  My Jobs
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Current Job</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer slide-in-left">
          <div className="container" id="bdb-proposer-content">
            details about your posted job
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_routerActions: bindActionCreators(routerActions, dispatch),
    a_addJob: bindActionCreators(addJob, dispatch)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProposerCurrentAddedJob);
