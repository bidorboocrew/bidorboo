import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import {
  awardBidder,
  getPostedJobDetails,
  markBidAsSeen,
} from '../../app-state/actions/jobActions';
import CurrentPostedJobDetailsCard from '../../components/proposer-components/CurrentPostedJobDetailsCard';
import ProposerStepper from './ProposerStepper';

import { switchRoute } from '../../utils';

class CurrentJob extends React.Component {
  constructor(props) {
    super(props);

    this.jobId = null;
    // react router state
    this.isNewlyPostedJob = props.location && props.location.state && props.location.state.isNewJob;

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
    const { selectedActivePostedJob, userDetails, a_awardBidder, a_markBidAsSeen } = this.props;

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
                My Requests
              </a>
            </li>
            <li className="is-active">
              <a aria-current="page">
                {selectedActivePostedJob ? selectedActivePostedJob.title : 'Selected Service'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <div className="container bdbPage pageWithStepper desktop">
        <ProposerStepper currentStepNumber={3} />

        {selectedActivePostedJob && selectedActivePostedJob._id ? (
          <CurrentPostedJobDetailsCard
            breadCrumb={breadCrumb}
            currentUser={userDetails}
            job={selectedActivePostedJob}
            awardBidder={a_awardBidder}
            markBidAsSeen={a_markBidAsSeen}
            hideBidTable={true}
          />
        ) : null}
      </div>
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
    a_markBidAsSeen: bindActionCreators(markBidAsSeen, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentJob);
