import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';

import {
  getPostedRequestAndBidsForRequester,
  markBidAsSeen,
} from '../../app-state/actions/requestActions';

import BidsTable from './components/BidsTable';
import AcceptBidAndTaskerModal from './components/AcceptBidAndTaskerModal';

import {
  getMeTheRightRequestCard,
  POINT_OF_VIEW,
  REQUEST_STATES,
} from '../../bdb-tasks/getMeTheRightCard';
import { RenderBackButton, requesterViewRerouteBasedOnRequestState } from '../commonComponents';

const FETCH_INTERVAL = 5000;
const FETCH_DURATION = 30; //20times*15second=3mins of fetching then we stop

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
    if (document.visibilityState === 'hidden') {
      //  do nothing
    } else if (this.numberOfFetches > 0) {
      const { selectedRequestWithBids } = this.props;
      this.props.getPostedRequestAndBidsForRequester(selectedRequestWithBids._id);
      this.numberOfFetches--;
    }
  };

  componentDidMount() {
    // if route changed reload the request
    const { selectedRequestWithBids, getPostedRequestAndBidsForRequester, match } = this.props;

    let newRequestId = match.params.requestId;
    if (!selectedRequestWithBids) {
      getPostedRequestAndBidsForRequester(newRequestId);
    } else if (selectedRequestWithBids._id !== newRequestId) {
      // fetch it
      getPostedRequestAndBidsForRequester(newRequestId);
    }
    this.getMoreBids = setInterval(this.fetchMostRecentBids, FETCH_INTERVAL);
  }

  componentWillUnmount() {
    this.getMoreBids && clearInterval(this.getMoreBids);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedRequestWithBids, markBidAsSeen, paymentIsInProgress } = this.props;

    if (!selectedRequestWithBids || !selectedRequestWithBids._id) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel={'Loading Your Request'} isLoading={true} size={'large'} />
        </div>
      );
    }

    if (
      selectedRequestWithBids &&
      !!selectedRequestWithBids.state &&
      selectedRequestWithBids.state !== REQUEST_STATES.OPEN
    ) {
      requesterViewRerouteBasedOnRequestState(selectedRequestWithBids);
      return null;
    }

    const { state } = selectedRequestWithBids;
    const shouldShowBidsTable = state === REQUEST_STATES.OPEN;

    const { showBidReviewModal, bidUnderReview } = this.state;

    const bidList = selectedRequestWithBids._bidsListRef;

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
          <AcceptBidAndTaskerModal closeModal={this.hideBidReviewModal} bid={bidUnderReview} />
        )}

        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth slide-in-right">
            <RenderBackButton />
            {getMeTheRightRequestCard({
              request: selectedRequestWithBids,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.REQUESTER,
            })}

            <br />
            {shouldShowBidsTable && (
              <BidsTable
                fetchMostRecentBids={this.fetchMostRecentBids}
                requestId={selectedRequestWithBids._id}
                bidList={bidList}
                markBidAsSeen={markBidAsSeen}
                viewedByCount={
                  selectedRequestWithBids.viewedBy ? selectedRequestWithBids.viewedBy.length : 0
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

const mapStateToProps = ({ requestsReducer, userReducer, uiReducer }) => {
  return {
    selectedRequestWithBids: requestsReducer.selectedRequestWithBids,
    userDetails: userReducer.userDetails,
    paymentIsInProgress: uiReducer.paymentIsInProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getPostedRequestAndBidsForRequester: bindActionCreators(
      getPostedRequestAndBidsForRequester,
      dispatch,
    ),
    markBidAsSeen: bindActionCreators(markBidAsSeen, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewRequestAndBidsPage);
