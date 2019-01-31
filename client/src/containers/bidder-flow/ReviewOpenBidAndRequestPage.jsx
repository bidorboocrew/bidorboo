import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { getOpenBidDetails, updateBid } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import MyOpenBidJobDetails from './components/MyOpenBidJobDetails';
import RequesterAndOpenBid from './components/RequesterAndOpenBid';

class ReviewOpenBidAndRequestPage extends React.Component {
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

    this.props.a_getOpenBidDetails(this.bidId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedOpenBid, a_updateBid } = this.props;
    // while fetching the job
    if (
      !selectedOpenBid ||
      !selectedOpenBid._id ||
      !selectedOpenBid._jobRef ||
      !selectedOpenBid._jobRef._id
    ) {
      return (
        <div className="container is-widescreen bidorbooContainerMargins">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const selectedAwardedJob = selectedOpenBid._jobRef;
    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;

    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        {breadCrumbs({ activePageTitle: title })}
        <div className="columns is-multiline is-centered">
          <div className="column">
            <RequesterAndOpenBid
              bid={selectedOpenBid}
              job={selectedAwardedJob}
              updateBidAction={a_updateBid}
            />
            <MyOpenBidJobDetails job={selectedAwardedJob} />
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
    a_getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
    a_updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewOpenBidAndRequestPage);

const breadCrumbs = ({ activePageTitle }) => {
  return (
    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
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
