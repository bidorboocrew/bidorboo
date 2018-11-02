/**
 * This will handle showing details of the job when user
 * - selects 1 job
 * - posts a new job
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { addJob, awardBidder } from '../../app-state/actions/jobActions';
import JobAndBidsDetailView from '../../components/JobAndBidsDetailView';

import { switchRoute } from '../../utils';

class CurrentAwardedJob extends React.Component {
  render() {
    const { selectedJob, userDetails, a_awardBidder } = this.props;

    const breadCrumb = (
      <div style={{ marginTop: '1rem' }} className="container">
        <nav style={{ marginLeft: '1rem' }} className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
                }}
              >
                Awarded Jobs
              </a>
            </li>
            <li className="is-active">
              <a aria-current="page">Selected Job</a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <React.Fragment>
        <section className="mainSectionContainer slide-in-left">
          <div className="container">
            <JobAndBidsDetailView
              breadCrumb={breadCrumb}
              currentUser={userDetails}
              job={selectedJob}
              awardBidder={a_awardBidder}
              isForAwarded
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    selectedJob: jobsReducer.selectedAwardedJob,
    userDetails: userModelReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch),
    a_awardBidder: bindActionCreators(awardBidder, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAwardedJob);
