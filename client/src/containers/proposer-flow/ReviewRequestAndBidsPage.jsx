import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { Spinner } from '../../components/Spinner';

import {
  getPostedJobDetails,
  markBidAsSeen,
} from '../../app-state/actions/jobActions';

import JobFullDetailsCard from './components/JobFullDetailsCard';
import BidsTable from './components/BidsTable';
import ReviewBidAndBidder from './components/ReviewBidAndBidder';
import { switchRoute } from '../../utils';

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
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
      return null;
    }

    this.props.a_getPostedJobDetails(this.jobId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedJobWithBids, a_markBidAsSeen } = this.props;
    // while fetching the job
    if (!selectedJobWithBids || !selectedJobWithBids._id) {
      return (
        <section className="section">
          <div className="container">
            <Spinner isLoading={true} size={'large'} />
          </div>
        </section>
      );
    }

    const title = templatesRepo[selectedJobWithBids.fromTemplateId].title;
    const { showBidReviewModal, bidUnderReview } = this.state;

    return (
      <section className="section">
        <div className="container">
          {showBidReviewModal && (
            <ReviewBidAndBidder bid={bidUnderReview} handleCancel={this.hideBidReviewModal} />
          )}

          {!showBidReviewModal && (
            <React.Fragment>
              {breadCrumbs({
                activePageTitle: title,
              })}

              <div className="columns is-multiline">
                <div className="column">
                  <BidsTable
                    jobId={selectedJobWithBids._id}
                    bidList={selectedJobWithBids._bidsListRef}
                    markBidAsSeen={a_markBidAsSeen}
                    showBidReviewModal={this.showBidReviewModal}
                  />
                </div>
                <div className="column">
                  <JobFullDetailsCard job={selectedJobWithBids} />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
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
    a_getPostedJobDetails: bindActionCreators(getPostedJobDetails, dispatch),
    a_markBidAsSeen: bindActionCreators(markBidAsSeen, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewRequestAndBidsPage);

const breadCrumbs = (props) => {
  const { activePageTitle } = props;
  return (
    <div style={{ marginBottom: '1rem' }}>
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
            <a aria-current="page">{activePageTitle}</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
