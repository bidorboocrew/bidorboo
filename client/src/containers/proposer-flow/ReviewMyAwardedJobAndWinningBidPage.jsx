import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { Spinner } from '../../components/Spinner';
import {
  getAwardedBidFullDetails,
  proposerConfirmsJobCompletion,
} from '../../app-state/actions/jobActions';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightRequestCard';

class ReviewMyAwardedJobAndWinningBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
  }

  componentDidMount() {
    const { getAwardedBidFullDetails } = this.props;
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
      return null;
    }

    getAwardedBidFullDetails(this.jobId);
  }

  componentDidUpdate() {
    // if route changed reload the job
    let newJobId = this.jobId;

    if (this.props.match && this.props.match.params && this.props.match.params.jobId) {
      newJobId = this.props.match.params.jobId;
    }
    if (newJobId !== this.jobId) {
      this.jobId = newJobId;
      if (!this.jobId) {
        switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
        return null;
      }

      this.props.getAwardedBidFullDetails(this.jobId);
    }
  }

  render() {
    const { selectedAwardedJob } = this.props;

    if (!selectedAwardedJob || !selectedAwardedJob._id) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    return (
      <div className="container is-widescreen">
        <div className="columns is-centered">
          <div className="column is-narrow">
            <div style={{ marginBottom: '0.7rem' }}>
              <a
                className="button is-outlined"
                onClick={() => switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs)}
              >
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>My Requests</span>
              </a>
            </div>
            {getMeTheRightRequestCard({
              job: selectedAwardedJob,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.REQUESTER,
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAwardedBidFullDetails: bindActionCreators(getAwardedBidFullDetails, dispatch),
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewMyAwardedJobAndWinningBidPage);
