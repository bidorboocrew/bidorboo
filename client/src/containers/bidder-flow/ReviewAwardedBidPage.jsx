import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { getAwardedBidDetails } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import OthersJobDetailsCard from './components/OthersJobDetailsCard';
import RequesterAndMyAwardedBidDetailsCard from './components/RequesterAndMyAwardedBidDetailsCard';

class ReviewAwardedBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.bidId = null;
    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    }
    // http://localhost:3000/bidder/review-my-bid-details/5c22963be212a73af0a12f28
  }

  componentDidMount() {
    if (!this.bidId) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
      return null;
    }
debugger
    this.props.a_getAwardedBidDetails(this.bidId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedAwardedBid } = this.props;
    // while fetching the job
    debugger;

    if (
      !selectedAwardedBid ||
      !selectedAwardedBid._id ||
      !selectedAwardedBid._jobRef ||
      !selectedAwardedBid._jobRef._id
    ) {
      return (
        <section className="section">
          <div className="container">
            <Spinner isLoading={true} size={'large'} />
          </div>
        </section>
      );
    }

    const selectedAwardedJob = selectedAwardedBid._jobRef;
    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;

    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <p className="subtitle has-text-light is-5">
                    <strong className="title has-text-light">My Bids</strong>
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </section>
        <section className="section">
          <div className="container">
            {breadCrumbs({ activePageTitle: title })}
            <div className="columns is-gapless is-multiline is-centered">
              <div className="column is-4">
                <RequesterAndMyAwardedBidDetailsCard
                  bid={selectedAwardedBid}
                  job={selectedAwardedJob}
                />
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
    selectedAwardedBid: bidsReducer.selectedAwardedBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAwardedBidDetails: bindActionCreators(getAwardedBidDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAwardedBidPage);

const breadCrumbs = ({ activePageTitle }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.mybids);
              }}
            >
              My Bids
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
