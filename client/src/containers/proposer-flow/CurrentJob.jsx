/**
 * This will handle showing details of the job when user
 * - selects 1 job
 * - posts a new job
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { awardBidder, getPostedJobDetails } from '../../app-state/actions/jobActions';
import CurrentPostedJobDetailsCard from '../../components/proposer-components/CurrentPostedJobDetailsCard';

import { switchRoute } from '../../utils';

class CurrentJob extends React.Component {
  constructor(props) {
    super(props);

    this.jobId = null;
    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    } else {
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
      return null;
    }
  }

  componentDidMount() {
    const { a_getPostedJobDetails } = this.props;

    if (!a_getPostedJobDetails || !this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
      return null;
    }

    a_getPostedJobDetails(this.jobId);
  }
  render() {
    const { selectedActivePostedJob, userDetails, a_awardBidder } = this.props;

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
                {selectedActivePostedJob ? selectedActivePostedJob.title : 'Selected Job'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <section className="mainSectionContainer slide-in-left">
        {selectedActivePostedJob && selectedActivePostedJob._id ? (
          <CurrentPostedJobDetailsCard
            breadCrumb={breadCrumb}
            currentUser={userDetails}
            job={selectedActivePostedJob}
            awardBidder={a_awardBidder}
          />
        ) : (
          <div>loading</div>
        )}
      </section>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    selectedActivePostedJob: jobsReducer.selectedActivePostedJob,
    userDetails: userModelReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_awardBidder: bindActionCreators(awardBidder, dispatch),
    a_getPostedJobDetails: bindActionCreators(getPostedJobDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentJob);
