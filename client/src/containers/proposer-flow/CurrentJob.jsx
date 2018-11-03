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
import OwnersJobDetailsCard from '../../components/proposer-components/OwnersJobDetailsCard';

import { switchRoute } from '../../utils';

class CurrentJob extends React.Component {
  render() {
    const { selectedActiveJob, userDetails, a_awardBidder } = this.props;

    const breadCrumb = (
      <div style={{ marginBottom: '1rem' }} className="container">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
                }}
              >
                My Jobs
              </a>
            </li>
            <li className="is-active">
              <a aria-current="page">
                {selectedActiveJob ? selectedActiveJob.title : 'Selected Job'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <section className="mainSectionContainer slide-in-left">
        <OwnersJobDetailsCard
          breadCrumb={breadCrumb}
          currentUser={userDetails}
          job={selectedActiveJob}
          awardBidder={a_awardBidder}
        />
      </section>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    selectedActiveJob: jobsReducer.selectedActiveJob,
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
)(CurrentJob);
