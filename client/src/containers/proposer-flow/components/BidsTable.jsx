import React from 'react';

import ReactStars from 'react-stars';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import {
  BidsTableVerifiedVia,
  CenteredUserImageAndRating,
} from '../../../containers/commonComponents';
import * as Constants from '../../../constants/enumConstants';

// confirm award and pay
const BIDORBOO_SERVICECHARGE = 0.06;
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
    const { bidList, viewedByCount } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    if (!areThereAnyBids) {
      return <TableWithNoBids viewedByCount={viewedByCount} />;
    }

    let tableRows = bidList.map((bid) => {
      const totalCharge =
        bid.bidAmount && bid.bidAmount.value
          ? Math.ceil(bid.bidAmount.value * BIDORBOO_SERVICECHARGE) + bid.bidAmount.value
          : 'not specified';

      return (
        <div key={bid._id} className="column is-narrow isforCards slide-in-bottom-small">
          <TaskerBidCard
            otherUserProfileInfo={bid._bidderRef}
            bidAmountHtml={() => (
              <div className="firstButtonInCard">
                <div style={{ fontSize: 12 }} className="has-text-centered has-text-grey">
                  will do it for
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.openBidDetailsModal(bid);
                  }}
                  className="button is-success has-text-centered is-size-5 has-text-weight-semibold"
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
        <div style={{ background: 'transparent' }} className="tabs is-medium is-centered">
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
      <div style={{ background: 'transparent' }} className="tabs is-medium is-centered">
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
      <div style={{ marginBottom: '1.5rem ', width: '13rem' }} className="card cardWithButton">
        <div style={{ padding: '1rem' }} className="card-content">
          <CenteredUserImageAndRating userDetails={otherUserProfileInfo} />

          <div className="group">
            <label className="label">Verifications</label>
            <BidsTableVerifiedVia userDetails={otherUserProfileInfo} />
          </div>
        </div>

        {bidAmountHtml()}
        {/* <div className="field">
            <BidsTableVerifiedVia userDetails={otherUserProfileInfo} />
          </div> */}

        {/* <div style={{ marginBottom: '2rem' }} className="content">
            <div className="has-text-centered">
              <figure
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
                }}
                style={{ margin: 'auto', width: 128 }}
                className="image is-128x128"
              >
                <img
                   onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
                }}

                  style={{
                    borderRadius: '100%',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                  }}
                  src={otherUserProfileInfo.profileImage.url}
                />
              </figure>
              <div style={{ marginBottom: 0 }} className={`title`}>
                <span>{otherUserProfileInfo.displayName}</span>
              </div>
              <div className={`has-text-grey`} style={{ fontWeight: 300 }}>
                ({membershipStatusDisplay})
              </div>
              {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                <div className="has-text-grey" style={{ lineHeight: '52px' }}>
                  - No Ratings Yet -
                </div>
              ) : (
                <ReactStars
                  className="ReactStars"
                  half
                  count={5}
                  value={globalRating}
                  edit={false}
                  size={35}
                  color1={'lightgrey'}
                  color2={'#ffd700'}
                />
              )}
            </div>

            <div>
              <span style={{ marginRight: 12 }} className={`has-text-weight-bold`}>
                {numberOfTimesBeenRated}
              </span>
              <span>Ratings Recieved</span>
            </div>
            <div>
              <span style={{ marginRight: 12 }} className={`has-text-weight-bold`}>
                {fulfilledBids.length}
              </span>
              <span>Completed Tasks</span>
            </div>
            <div>
              <span style={{ marginRight: 12 }} className={`has-text-weight-bold`}>
                {canceledBids.length}
              </span>
              <span>Cancellations</span>
            </div>
            <br />
            <div className="field">
              <BidsTableVerifiedVia
                userDetails={otherUserProfileInfo}
                isCentered={false}
                smallfont={false}
              />
            </div>
            <div style={{ marginBottom: '3rem' }} className="field">
              <div>Last Review</div>
              <div style={{ fontStyle: 'italic' }} className="control">
                {displayComment}
              </div>
            </div>
          </div> */}

        {/* {bidAmountHtml()} */}
      </div>
    );
  }
}

const ReviewComments = ({ commenterDisplayName, commenterProfilePicUrl, comment }) => {
  return (
    <article
      style={{ cursor: 'default', border: '1px solid #ededed', padding: 2 }}
      className="media"
    >
      <figure style={{ margin: '0.5rem' }} className="media-left">
        <p className="image is-size-64x64">
          <img src={commenterProfilePicUrl} />
        </p>
      </figure>
      <div style={{ padding: '0.5rem' }} className="media-content">
        <div className="content">
          <div>{commenterDisplayName} wrote:</div>
          <p>{comment}</p>
        </div>
      </div>
    </article>
  );
};
