import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { Spinner } from '../../components/Spinner';

import { getPostedJobDetails, markBidAsSeen } from '../../app-state/actions/jobActions';

import BidsTable from './components/BidsTable';
import AcceptBidAndBidderModal from './components/AcceptBidAndBidderModal';

import jobTemplateIdToDefinitionObjectMapper from '../../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';
import getFullDetailsCardByTemplateJobId from '../../bdb-tasks/getFullDetailsCardByTemplateJobId';

class ReviewRequestAndBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

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

    const jobDefinition = jobTemplateIdToDefinitionObjectMapper[selectedJobWithBids.fromTemplateId];
    if (!jobDefinition) {
      alert(`unknown job template ${selectedJobWithBids.fromTemplateId}`);
      return null;
    }

    const title = jobDefinition.TITLE;
    const { showBidReviewModal, bidUnderReview } = this.state;

    return (
      <div className="container is-widescreen">
        {showBidReviewModal && (
          <AcceptBidAndBidderModal closeModal={this.hideBidReviewModal} bid={bidUnderReview} />
        )}

        <div className="columns is-centered">
          <div className="column is-narrow">
            {breadCrumbs({
              activePageTitle: title,
            })}

            {getFullDetailsCardByTemplateJobId(selectedJobWithBids)}
            <br />
            <section className="hero is-medium is-dark is-bold">
              <div className="hero-body">
                <div>
                  <h1 className="is-size-5 has-text-weight-bold has-text-centered">
                    Choose a tasker
                  </h1>
                </div>
              </div>
            </section>

            <BidsTable
              jobId={selectedJobWithBids._id}
              bidList={selectedJobWithBids._bidsListRef}
              markBidAsSeen={markBidAsSeen}
              showBidReviewModal={this.showBidReviewModal}
            />

            {/* <JobFullDetailsCard job={selectedJobWithBids} /> */}
          </div>
        </div>
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
    <div style={{ marginBottom: '0.7rem' }}>
      <a
        className="button is-outlined is-small"
        onClick={() => switchRoute(ROUTES.CLIENT.PROPOSER.dynamicMyOpenJobs('postedJobs'))}
      >
        <span className="icon">
          <i className="far fa-arrow-alt-circle-left" />
        </span>
        <span>My Requests</span>
      </a>
    </div>
  );
};
