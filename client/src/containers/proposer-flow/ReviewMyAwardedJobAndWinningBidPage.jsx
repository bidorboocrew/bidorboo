import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { RenderBackButton } from '../commonComponents';

import { Spinner } from '../../components/Spinner';
import {
  getAwardedJobFullDetailsforRequester,
  proposerConfirmsJobCompletion,
} from '../../app-state/actions/jobActions';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class ReviewMyAwardedJobAndWinningBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
  }

  componentDidMount() {
    const { getAwardedJobFullDetailsforRequester } = this.props;
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
      return null;
    }

    getAwardedJobFullDetailsforRequester(this.jobId);
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
        switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
        return null;
      }

      this.props.getAwardedJobFullDetailsforRequester(this.jobId);
    }
  }

  render() {
    const { selectedAwardedJob } = this.props;

    if (!selectedAwardedJob || !selectedAwardedJob._id) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel={'Getting Your Request Details'} isLoading={true} size={'large'} />
        </div>
      );
    }

    return (
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          <RenderBackButton />
          {getMeTheRightRequestCard({
            job: selectedAwardedJob,
            isSummaryView: false,
            pointOfView: POINT_OF_VIEW.REQUESTER,
          })}
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
    getAwardedJobFullDetailsforRequester: bindActionCreators(getAwardedJobFullDetailsforRequester, dispatch),
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewMyAwardedJobAndWinningBidPage);
