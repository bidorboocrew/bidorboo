/**
 * This will handle showing details of the bid when user
 * - selects 1 bid
 * - posts a new bid
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { getOpenBidDetails } from '../../app-state/actions/bidsActions';
import { switchRoute } from '../../utils';

import CurrentOpenBidAndJobDetailsView from '../../components/bidder-components/CurrentOpenBidAndJobDetailsView';
import BidderStepper from './BidderStepper';

class CurrentPostedBid extends React.Component {
  constructor(props) {
    super(props);

    this.bidId = null;
    // react router state
    // this.bid = props.location && props.location.state && props.location.state.bid;

    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    } else {
      switchRoute(ROUTES.CLIENT.BIDDER.mybids);
      return null;
    }
  }

  componentDidMount() {
    const { a_getOpenBidDetails } = this.props;
    if (!a_getOpenBidDetails || !this.bidId) {
      switchRoute(ROUTES.CLIENT.BIDDER.mybids);
      return null;
    } else {
      a_getOpenBidDetails(this.bidId);
    }
  }

  render() {
    const { selectedOpenBid, isLoading, currentUserDetails } = this.props;

    return (
      <React.Fragment>
        <BidderStepper currentStepNumber={3} />

        <div className="container bdbPage pageWithStepper desktop">
          <CurrentOpenBidAndJobDetailsView
            currentUser={currentUserDetails}
            bid={selectedOpenBid}
            isLoading={isLoading}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ bidsReducer, userModelReducer }) => {
  return {
    selectedOpenBid: bidsReducer.selectedOpenBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userModelReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentPostedBid);
