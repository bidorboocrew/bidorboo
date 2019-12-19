import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { getOpenBidDetails, updateBid, deleteOpenBid } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import { RenderBackButton } from '../commonComponents';
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
      switchRoute(ROUTES.CLIENT.TASKER.root);
      return null;
    }

    this.props.getOpenBidDetails(this.bidId);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isLoading && (!this.props.selectedOpenBid || !this.props.selectedOpenBid._id)) {
      // xxxx show cant find job or something instead of ugly redirect
      // could not find the job so we redirected you
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
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          . <RenderBackButton />
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
