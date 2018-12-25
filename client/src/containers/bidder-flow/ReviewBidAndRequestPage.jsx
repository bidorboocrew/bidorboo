import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { getOpenBidDetails } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import OthersJobDetailsCard from './components/OthersJobDetailsCard';
import MyOpenBidDetailsCard from './components/MyOpenBidDetailsCard';

class ReviewBidAndRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.bidId = null;

    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    }
    // http://localhost:3000/bidder/review-my-bid-details/5c22963be212a73af0a12f28
  }

  componentDidMount() {
    debugger;
    if (!this.bidId) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
      return null;
    }

    this.props.a_getOpenBidDetails(this.bidId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedOpenBid } = this.props;
    // while fetching the job
    debugger
    if (
      !selectedOpenBid ||
      !selectedOpenBid._id ||
      !selectedOpenBid._jobRef ||
      !selectedOpenBid._jobRef._id
    ) {
      return (
        <section className="section">
          <div className="container">
            <Spinner isLoading={true} size={'large'} />
          </div>
        </section>
      );
    }

    const selectedAwardedJob = selectedOpenBid._jobRef;

    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <p className="subtitle has-text-light is-5">
                    <strong className="title has-text-light">Provide A Service</strong>
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="columns is-gapless is-multiline is-centered">
              <div className="column is-4">
                <MyOpenBidDetailsCard bid={selectedOpenBid} />
              </div>
              <div className="column">
                <OthersJobDetailsCard job={selectedAwardedJob} />
              </div>
            </div>
          </div>
        </section>
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
    a_getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewBidAndRequestPage);
