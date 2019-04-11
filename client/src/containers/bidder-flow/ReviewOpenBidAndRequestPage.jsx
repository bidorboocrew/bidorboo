import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { getOpenBidDetails, updateBid } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';

import RequesterAndOpenBid from './components/RequesterAndOpenBid';
import jobIdToDefinitionObjectMapper from '../../bdb-tasks/jobIdToDefinitionObjectMapper';
import getBidOnFullDetailsCardByTemplateJobId from '../../bdb-tasks/getBidOnFullDetailsCardByTemplateJobId';

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

    this.props.getOpenBidDetails(this.bidId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedOpenBid, updateBid } = this.props;
    // while fetching the job
    if (
      !selectedOpenBid ||
      !selectedOpenBid._id ||
      !selectedOpenBid._jobRef ||
      !selectedOpenBid._jobRef._id
    ) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const selectedAwardedJob = selectedOpenBid._jobRef;
    const title = jobIdToDefinitionObjectMapper[selectedAwardedJob.fromTemplateId].TITLE;

    return (
      <div className="container is-widescreen">
        <div className="columns is-centered">
          <div className="column is-narrow">
            {breadCrumbs({ activePageTitle: title })}

            <RequesterAndOpenBid
              bid={selectedOpenBid}
              job={selectedAwardedJob}
              updateBidAction={updateBid}
            />
            {getBidOnFullDetailsCardByTemplateJobId(selectedAwardedJob)}
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
    getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
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
