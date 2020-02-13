import React from 'react';
import OtherUserProfileForReviewPageForBid from '../../OtherUserProfileForReviewPageForBid.jsx';
// import { VerifiedVia, UserImageAndRating } from '../../../containers/commonComponents';
export default class BidsTable extends React.Component {
  openBidDetailsModal = (bid) => {
    const { markBidAsSeen, requestId, showBidReviewModal } = this.props;

    if (bid.isNewBid) {
      markBidAsSeen(requestId, bid._id);
    }

    if (showBidReviewModal) {
      showBidReviewModal(bid);
    }
  };

  render() {
    const { bidList, viewedByCount } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    if (!areThereAnyBids) {
      return <TableWithNoBids viewedByCount={viewedByCount} />;
    }

    let tableRows = bidList.map((bid) => {
      const { value: totalCharge } = bid.requesterPayment;

      return (
        <div
          style={{ margin: '1.5rem' }}
          key={bid._id}
          className="column is-12 slide-in-bottom-small"
        >
          <TaskerBidCard
            otherUserProfileInfo={bid._taskerRef}
            bidAmountHtml={() => (
              <div className="centeredButtonInCard">
                {/* <div className="has-text-centered has-text-grey">
                  <span style={{ fontSize: 12 }}>Will do it for</span>
                </div> */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.openBidDetailsModal(bid);
                  }}
                  className="button is-success has-text-centered is-fullwidth"
                >
                  <span style={{ marginRight: 4 }}>{`Book for `}</span>
                  <span className="has-text-weight-bold">(${totalCharge})</span>
                  {bid.isNewBid && (
                    <span
                      style={{ position: 'absolute', top: -4, right: 0, fontSize: 10 }}
                      className="has-text-danger"
                    >
                      <i className="fas fa-circle"></i>
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
        <div
          style={{ background: 'transparent', marginBottom: 0 }}
          className="tabs is-centered is-medium"
        >
          <ul>
            <li className="color-change-2x is-active">
              <a>
                <span className="color-change-2x icon is-small has-text-weight-semibold">
                  <i className="fas fa-user-tie" aria-hidden="true" />
                </span>
                <span className="color-change-2x has-text-weight-semibold">Available Taskers</span>
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
              <span>Waiting For Bids</span>
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

    const { rating } = otherUserProfileInfo;

    // const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const { lastComment } = rating;

    let displayComment = lastComment || 'This user was not reviewed yet!';
    if (displayComment.length > 100) {
      displayComment = displayComment.substring(0, 99);
    }

    return (
      <div style={{ marginBottom: '3rem ' }} className="card">
        <div className="card-content">
          <OtherUserProfileForReviewPageForBid
            match={{ params: { userId: otherUserProfileInfo._id } }}
          ></OtherUserProfileForReviewPageForBid>

          {/* <UserImageAndRating userDetails={otherUserProfileInfo} /> */}

          {/* <div className="group">
            <VerifiedVia userDetails={otherUserProfileInfo} />
          </div> */}
        </div>

        {bidAmountHtml()}
      </div>
    );
  }
}
