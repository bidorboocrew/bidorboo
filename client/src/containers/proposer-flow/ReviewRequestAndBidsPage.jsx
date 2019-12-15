import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';

import { RenderBackButton, redirectBasedOnJobState } from '../commonComponents';

import { Spinner } from '../../components/Spinner';

import { getPostedJobAndBidsForRequester, markBidAsSeen } from '../../app-state/actions/jobActions';

import BidsTable from './components/BidsTable';
import AcceptBidAndBidderModal from './components/AcceptBidAndBidderModal';

import {
  getMeTheRightRequestCard,
  POINT_OF_VIEW,
  REQUEST_STATES,
} from '../../bdb-tasks/getMeTheRightCard';

const FETCH_INTERVAL = 15000;
const FETCH_DURATION = process.env.NODE_ENV === 'production' ? 20 : 0; //20times*15second=3mins of fetching then we stop

class ReviewRequestAndBidsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBidReviewModal: false,
      bidUnderReview: {},
    };

    this.numberOfFetches = FETCH_DURATION;
  }

  fetchMostRecentBids = () => {
    if (document.visibilityState == 'hidden') {
      //  do nothing
    } else {
      if (this.numberOfFetches > 0) {
        const { selectedJobWithBids } = this.props;
        this.props.getPostedJobAndBidsForRequester(selectedJobWithBids._id);
        console.log('fetched more bids');
      }
      this.numberOfFetches--;
    }
  };

  componentDidMount() {
    // if route changed reload the job
    const { selectedJobWithBids } = this.props;

    let newJobId = this.props.match.params.jobId;
    if (!selectedJobWithBids) {
      this.props.getPostedJobAndBidsForRequester(newJobId);
    } else if (selectedJobWithBids._id !== newJobId) {
      // fetch it
      this.props.getPostedJobAndBidsForRequester(newJobId);
    } else {
      if (selectedJobWithBids.state !== REQUEST_STATES.OPEN) {
        redirectBasedOnJobState(selectedJobWithBids);
      }
    }

    this.getMoreBids = setInterval(this.fetchMostRecentBids, FETCH_INTERVAL);
  }
  componentWillUnmount() {
    clearInterval(this.getMoreBids);
    console.log('interval cleared');
  }

  // componentDidUpdate() {}

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
          <div className="column limitLargeMaxWidth slide-in-right">
            <RenderBackButton />
            {getMeTheRightRequestCard({
              job: selectedJobWithBids,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.REQUESTER,
            })}

            <br />
            {shouldShowBidsTable && (
              <BidsTable
                fetchMostRecentBids={this.fetchMostRecentBids}
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
    getPostedJobAndBidsForRequester: bindActionCreators(getPostedJobAndBidsForRequester, dispatch),
    markBidAsSeen: bindActionCreators(markBidAsSeen, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewRequestAndBidsPage);
