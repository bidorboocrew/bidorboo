import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { Spinner } from '../../components/Spinner';
import {
  getAwardedBidFullDetails,
  proposerConfirmsJobCompletion,
} from '../../app-state/actions/jobActions';

import JobFullDetailsCard from './components/JobFullDetailsCard';
import BidderAndMyAwardedJob from './components/BidderAndMyAwardedJob';

class ReviewMyAwardedJobAndWinningBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
  }

  componentDidMount() {
    const { a_getAwardedBidFullDetails } = this.props;
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('awardedJobs'));
      return null;
    }

    a_getAwardedBidFullDetails(this.jobId);
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
        switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('awardedJobs'));
        return null;
      }

      this.props.a_getAwardedBidFullDetails(this.jobId);
    }
  }

  render() {
    const {
      selectedAwardedJob,
      a_proposerConfirmsJobCompletion,
      isReadOnlyView = false,
    } = this.props;

    if (!selectedAwardedJob || !selectedAwardedJob._id) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const { _awardedBidRef } = selectedAwardedJob;
    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;

    return (
      <div className="container is-widescreen">
        <div className="columns is-centered">
          <div className="column is-narrow">
            {!isReadOnlyView &&
              breadCrumbs({
                activePageTitle: title,
              })}
            <BidderAndMyAwardedJob
              proposerConfirmsJobCompletion={a_proposerConfirmsJobCompletion}
              bid={_awardedBidRef}
              job={selectedAwardedJob}
              isReadOnlyView={isReadOnlyView}
            />
            <JobFullDetailsCard job={selectedAwardedJob} />
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
    a_getAwardedBidFullDetails: bindActionCreators(getAwardedBidFullDetails, dispatch),
    a_proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewMyAwardedJobAndWinningBidPage);

const breadCrumbs = (props) => {
  const { activePageTitle } = props;
  return (
    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('awardedJobs'));
              }}
            >
              Awarded
            </a>
          </li>
          <li className="is-active">
            <a aria-current="page">{activePageTitle}</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
