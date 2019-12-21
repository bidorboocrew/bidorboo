import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import {
  getAwardedBidDetails,
  updateBid,
  deleteOpenBid,
} from '../../app-state/actions/bidsActions';
import { RenderBackButton, taskerViewRerouteBasedOnRequestState } from '../commonComponents';
import { Spinner } from '../../components/Spinner';

import { getMeTheRightBidCard, POINT_OF_VIEW,REQUEST_STATES } from '../../bdb-tasks/getMeTheRightCard';

class ReviewAwardedBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.bidId = null;

    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    }
  }

  componentDidMount() {
    if (!this.bidId) {
      switchRoute(ROUTES.CLIENT.TASKER.root);
      return null;
    }

    this.props.getAwardedBidDetails(this.bidId);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.isLoading &&
      (!this.props.selectedAwardedBid || !this.props.selectedAwardedBid._id)
    ) {
      // xxxx show cant find request or something instead of ugly redirect
      // could not find the request so we redirected you
      return switchRoute(ROUTES.CLIENT.TASKER.mybids);
    }
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedAwardedBid, updateBid, currentUserDetails, deleteOpenBid } = this.props;
    // while fetching the request
    if (
      !selectedAwardedBid ||
      !selectedAwardedBid._id ||
      !selectedAwardedBid._requestRef ||
      !selectedAwardedBid._requestRef._id
    ) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel="getting your bid details" isLoading={true} size={'large'} />
        </div>
      );
    }

    if (
      selectedAwardedBid &&
      !!selectedAwardedBid.state &&
      selectedAwardedBid.state !== REQUEST_STATES.OPEN
    ) {
      taskerViewRerouteBasedOnRequestState({
        jobState: selectedAwardedBid._requestRef.state,
        bidId: selectedAwardedBid._id,
      });
      return null;
    }

    return (
      <div>
        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth slide-in-right">
            <RenderBackButton />
            {getMeTheRightBidCard({
              bid: selectedAwardedBid,
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
    selectedAwardedBid: bidsReducer.selectedAwardedBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
    getAwardedBidDetails: bindActionCreators(getAwardedBidDetails, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAwardedBidPage);
