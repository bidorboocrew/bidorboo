import React from 'react';

import {
  BidsTableVerifiedVia,
  CenteredUserImageAndRating,
} from '../../../containers/commonComponents';
import * as Constants from '../../../constants/enumConstants';
import { getChargeDistributionDetails } from '../../commonUtils';
export default class BidsTable extends React.Component {
  openBidDetailsModal = (bid) => {
    const { markBidAsSeen, jobId, showBidReviewModal } = this.props;

    if (bid.isNewBid) {
      markBidAsSeen(jobId, bid._id);
    }

    if (showBidReviewModal) {
      showBidReviewModal(bid);
    }
  };

  render() {
    const { bidList, viewedByCount, fetchMostRecentBids } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    if (!areThereAnyBids) {
      return <TableWithNoBids viewedByCount={viewedByCount} />;
    }

    let tableRows = bidList.map((bid) => {
      const { value: bidValue } = bid.bidAmount;
      const { requesterTotalPayment: totalCharge } = getChargeDistributionDetails(bidValue);

      return (
        <div key={bid._id} className="column is-narrow isforCards slide-in-bottom-small">
          <TaskerBidCard
            otherUserProfileInfo={bid._bidderRef}
            bidAmountHtml={() => (
              <div className="centeredButtonInCard">
                <div style={{ fontSize: 12 }} className="has-text-centered has-text-grey">
                  will do it for
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.openBidDetailsModal(bid);
                  }}
                  className="button is-success has-text-centered is-fullwidth has-text-weight-semibold"
                >
                  ${totalCharge}
                  {bid.isNewBid && (
                    <span
                      style={{ position: 'absolute', top: -4, right: 0, fontSize: 10 }}
                      className="has-text-danger"
                    >
                      <i className="fas fa-circle" />
                    </span>
                  )}
                </button>
              </div>
            )}
          />
        </div>
      );
    });
    return (
      <React.Fragment>
        <div style={{ background: 'transparent', marginBottom: 0 }} className="tabs is-centered">
          <ul>
            <li>
              <a>
                <span className="icon is-small">
                  <i className="fas fa-user-tie" aria-hidden="true" />
                </span>
                <span>Available Taskers</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="columns is-multiline is-centered is-mobile">{tableRows}</div>
      </React.Fragment>
    );
  }
}

const TableWithNoBids = ({ viewedByCount }) => {
  return (
    <>
      <div style={{ background: 'transparent' }} className="tabs is-centered">
        <ul>
          <li>
            <a>
              <span className="icon is-small">
                <i className="fas fa-user-clock" aria-hidden="true" />
              </span>
              <span>Waiting For Taskers</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="card has-text-centered" style={{ height: 'unset' }}>
        <div className="card-content">
          <div className="content">
            <div className="subtitle">
              {`${viewedByCount ? viewedByCount : ''}`}

              {`${
                viewedByCount > 1 || !viewedByCount
                  ? 'Taskers are viewing your task and will place bids soon'
                  : 'Tasker is viewing your task and will place a bid soon'
              }`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

class TaskerBidCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  render() {
    const { otherUserProfileInfo, bidAmountHtml } = this.props;
    if (!otherUserProfileInfo) {
      return null;
    }

    const {
      _id,
      rating,

      membershipStatus,
    } = otherUserProfileInfo;

    const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const { globalRating, lastComment } = rating;

    let displayComment = lastComment || 'This user was not reviewed yet!';
    if (displayComment.length > 100) {
      displayComment = displayComment.substring(0, 99);
    }

    return (
      <div style={{ marginBottom: '1.5rem ', width: '15rem' }} className="card cardWithButton">
        <div style={{ padding: '1rem' }} className="card-content has-text-centered">
          <CenteredUserImageAndRating userDetails={otherUserProfileInfo} />

          <div className="group">
            <label className="label">Verifications</label>
            <BidsTableVerifiedVia userDetails={otherUserProfileInfo} />
          </div>
        </div>

        {bidAmountHtml()}
      </div>
    );
  }
}
