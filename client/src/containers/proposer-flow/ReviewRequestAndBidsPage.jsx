import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { Spinner } from '../../components/Spinner';

import { getPostedJobDetails, markBidAsSeen } from '../../app-state/actions/jobActions';

import JobFullDetailsCard from './components/JobFullDetailsCard';
import BidsTable from './components/BidsTable';
import ReviewBidAndBidder from './components/ReviewBidAndBidder';
import jobIdToDefinitionObjectMapper from '../../bdb-tasks/jobIdToDefinitionObjectMapper';
class ReviewRequestAndBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;
    debugger;
    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
    this.state = {
      showBidReviewModal: false,
      bidUnderReview: {},
    };
  }

  componentDidMount() {
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('postedJobs'));
      return null;
    }
    this.props.getPostedJobDetails(this.jobId);
  }

  componentDidUpdate(prevProps) {
    // if route changed reload the job
    let newJobId = this.jobId;

    if (this.props.match && this.props.match.params && this.props.match.params.jobId) {
      newJobId = this.props.match.params.jobId;
    }
    if (newJobId !== this.jobId) {
      this.jobId = newJobId;
      if (!this.jobId) {
        switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('postedJobs'));
        return null;
      }
      this.props.getPostedJobDetails(this.jobId);
    }
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedJobWithBids, markBidAsSeen } = this.props;
    // while fetching the job
    if (!selectedJobWithBids || !selectedJobWithBids._id) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const jobDefinition = jobIdToDefinitionObjectMapper[selectedJobWithBids.fromTemplateId];
    if (!jobDefinition) {
      alert(`unknown job template ${selectedJobWithBids.fromTemplateId}`);
      return null;
    }

    const title = jobDefinition.TITLE;
    const { showBidReviewModal, bidUnderReview } = this.state;

    return (
      <div className="container is-widescreen">
        {showBidReviewModal && (
          <ReviewBidAndBidder bid={bidUnderReview} handleCancel={this.hideBidReviewModal} />
        )}

        {!showBidReviewModal && (
          <div className="columns is-centered">
            <div className="column is-narrow">
              {breadCrumbs({
                activePageTitle: title,
              })}
              <BidsTable
                jobId={selectedJobWithBids._id}
                bidList={selectedJobWithBids._bidsListRef}
                markBidAsSeen={markBidAsSeen}
                showBidReviewModal={this.showBidReviewModal}
              />

              {/* <JobFullDetailsCard job={selectedJobWithBids} /> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    selectedJobWithBids: jobsReducer.selectedJobWithBids,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPostedJobDetails: bindActionCreators(getPostedJobDetails, dispatch),
    markBidAsSeen: bindActionCreators(markBidAsSeen, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewRequestAndBidsPage);

const breadCrumbs = (props) => {
  const { activePageTitle } = props;
  return (
    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('postedJobs'));
              }}
            >
              My Requests
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
