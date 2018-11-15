/**
 * This will handle showing details of the job when user
 * - selects 1 job
 * - posts a new job
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { addJob, getAwardedBidFullDetails } from '../../app-state/actions/jobActions';
import AwardedJobFullDetailsCard from '../../components/proposer-components/AwardedJobFullDetailsCard';

import { switchRoute } from '../../utils';

class CurrentAwardedJob extends React.Component {
  constructor(props) {
    super(props);

    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    } else {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }
  }

  componentDidMount() {
    const { a_getAwardedBidFullDetails } = this.props;

    if (!a_getAwardedBidFullDetails || !this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    a_getAwardedBidFullDetails(this.jobId);
  }

  render() {
    const { selectedAwardedJob, userDetails } = this.props;
    const breadCrumb = () => (
      <div style={{ marginBottom: '1rem' }} className="container">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
                }}
              >
               Requests Queue
              </a>
            </li>
            <li className="is-active">
              <a aria-current="page">
                {selectedAwardedJob ? selectedAwardedJob.title : 'Selected Service'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <section className="mainSectionContainer slide-in-left">
        {selectedAwardedJob && selectedAwardedJob._id ? (
          <AwardedJobFullDetailsCard
            breadCrumb={breadCrumb()}
            currentUser={userDetails}
            job={selectedAwardedJob}
          />
        ) : null}
      </section>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userModelReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch),
    a_getAwardedBidFullDetails: bindActionCreators(getAwardedBidFullDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAwardedJob);
