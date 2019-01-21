import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { getAwardedBidDetails } from '../../app-state/actions/bidsActions';
import { bidderConfirmsJobCompletion } from '../../app-state/actions/jobActions';

import { Spinner } from '../../components/Spinner';
import MyAwardedBidJobDetails from './components/MyAwardedBidJobDetails';
import RequesterAndMyAwardedBid from './components/RequesterAndMyAwardedBid';

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
      switchRoute(ROUTES.CLIENT.BIDDER.root);
      return null;
    }
    this.props.a_getAwardedBidDetails(this.bidId);
  }

  componentDidUpdate(prevProps) {
    // if route changed reload the job
    let newBidId = this.bidId;

    if (this.props.match && this.props.match.params && this.props.match.params.bidId) {
      newBidId = this.props.match.params.bidId;
    }
    if (newBidId !== this.bidId) {
      this.bidId = newBidId;
      if (!this.bidId) {
        switchRoute(ROUTES.CLIENT.BIDDER.root);
        return null;
      }
      this.props.a_getAwardedBidDetails(this.bidId);
    }
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const {
      selectedAwardedBid,
      a_bidderConfirmsJobCompletion,
      isReadOnlyView = false,
    } = this.props;
    // while fetching the job

    if (
      !selectedAwardedBid ||
      !selectedAwardedBid._id ||
      !selectedAwardedBid._jobRef ||
      !selectedAwardedBid._jobRef._id
    ) {
      return (
        <div className="container is-widescreen bidorbooAddTopMargin">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const selectedAwardedJob = selectedAwardedBid._jobRef;
    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;

    return (
      <div className="container is-widescreen bidorbooAddTopMargin">
        {!isReadOnlyView && breadCrumbs({ activePageTitle: title })}
        <div className="columns is-multiline is-centered">
          <div className="column">
            <RequesterAndMyAwardedBid
              bidderConfirmsJobCompletion={a_bidderConfirmsJobCompletion}
              bid={selectedAwardedBid}
              job={selectedAwardedJob}
              isReadOnlyView={isReadOnlyView}
            />
          </div>
          <div className="column">
            <MyAwardedBidJobDetails job={selectedAwardedJob} />
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
    a_getAwardedBidDetails: bindActionCreators(getAwardedBidDetails, dispatch),
    a_bidderConfirmsJobCompletion: bindActionCreators(bidderConfirmsJobCompletion, dispatch),
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
