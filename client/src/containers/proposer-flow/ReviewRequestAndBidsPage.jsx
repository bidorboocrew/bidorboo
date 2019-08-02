import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { Spinner } from '../../components/Spinner';

import { getPostedJobDetails, markBidAsSeen } from '../../app-state/actions/jobActions';

import BidsTable from './components/BidsTable';
import AcceptBidAndBidderModal from './components/AcceptBidAndBidderModal';

import {
  getMeTheRightRequestCard,
  POINT_OF_VIEW,
  REQUEST_STATES,
} from '../../bdb-tasks/getMeTheRightCard';
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
    // xxxxx saeed think about server load ? maybe let user fetch by reload
    // this.countdown = setInterval(this.fetchMostRecentBids, 10000);
  }

  componentWillUnmount() {
    // clearInterval(this.countdown);
  }

  fetchMostRecentBids = () => {
    // every 10 seconds fetch most recent bids
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
      return null;
    }
    this.props.getPostedJobDetails(this.jobId);
  };

  componentDidMount() {
    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
      return null;
    }
    this.props.getPostedJobDetails(this.jobId);
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
    const { selectedJobWithBids, markBidAsSeen, paymentIsInProgress } = this.props;
    // while fetching the job
    if (!selectedJobWithBids || !selectedJobWithBids._id) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel={'Loading Your request and Bids'} isLoading={true} size={'large'} />
        </div>
      );
    }

    const { state } = selectedJobWithBids;
    const shouldShowBidsTable = state === REQUEST_STATES.OPEN;

    const { showBidReviewModal, bidUnderReview } = this.state;

    const bidList = selectedJobWithBids._bidsListRef;

    return (
      <div>
        {paymentIsInProgress &&
          ReactDOM.createPortal(
            <div
              style={{
                background: '#363636',
                zIndex: 99,
                padding: 50,
                position: 'fixed',
                height: '100vh',
                top: '4rem',
                right: 0,
                width: '100%',
              }}
            >
              <div className="container is-widescreen">
                <Spinner
                  renderLabel={'Processing your payment. Please wait'}
                  isLoading={true}
                  size={'large'}
                  isDark={false}
                />
              </div>
            </div>,
            document.querySelector('#bidorboo-root-view'),
          )}

        {showBidReviewModal && (
          <AcceptBidAndBidderModal closeModal={this.hideBidReviewModal} bid={bidUnderReview} />
        )}

        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth">
            {getMeTheRightRequestCard({
              job: selectedJobWithBids,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.REQUESTER,
            })}

            <br />
            {shouldShowBidsTable && (
              <BidsTable
                jobId={selectedJobWithBids._id}
                bidList={bidList}
                markBidAsSeen={markBidAsSeen}
                viewedByCount={
                  selectedJobWithBids.viewedBy ? selectedJobWithBids.viewedBy.length : 0
                }
                showBidReviewModal={this.showBidReviewModal}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    selectedJobWithBids: jobsReducer.selectedJobWithBids,
    userDetails: userReducer.userDetails,
    paymentIsInProgress: uiReducer.paymentIsInProgress,
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
