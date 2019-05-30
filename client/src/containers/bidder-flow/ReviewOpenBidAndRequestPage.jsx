import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { getOpenBidDetails, updateBid, deleteOpenBid } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';

import { getMeTheRightBidCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class ReviewOpenBidAndRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.bidId = null;

    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    }
  }

  componentDidMount() {
    if (!this.bidId) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
      return null;
    }

    this.props.getOpenBidDetails(this.bidId);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isLoading && (!this.props.selectedOpenBid || !this.props.selectedOpenBid._id)) {
      // xxxx show cant find job or something instead of ugly redirect
      // could not find the job so we redirected you
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedOpenBid, updateBid, currentUserDetails, deleteOpenBid } = this.props;
    // while fetching the job
    if (
      !selectedOpenBid ||
      !selectedOpenBid._id ||
      !selectedOpenBid._jobRef ||
      !selectedOpenBid._jobRef._id
    ) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel="getting your bid details" isLoading={true} size={'large'} />
        </div>
      );
    }

    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">My Bid Details</h1>
            </div>
          </div>
        </section>
        <hr className="divider isTight" />
        <div className="columns is-centered">
          <div className="column limitLargeMaxWidth">
            <div style={{ marginBottom: '0.7rem' }}>
              <a
                className="button is-outlined"
                onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.mybids)}
              >
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>View My Other Bids</span>
              </a>
            </div>

            {getMeTheRightBidCard({
              bid: selectedOpenBid,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.TASKER,
              userDetails: currentUserDetails,
              updateBid,
              deleteOpenBid,
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    selectedOpenBid: bidsReducer.selectedOpenBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
    getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewOpenBidAndRequestPage);
