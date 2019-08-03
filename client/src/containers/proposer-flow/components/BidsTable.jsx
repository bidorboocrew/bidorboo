import React from 'react';

import ReactStars from 'react-stars';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { VerifiedVia } from '../../../containers/commonComponents';
// import { VerifiedVia } from '../../commonComponents';
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
        <TaskerBidCard
          key={bid._bidderRef._id}
          otherUserProfileInfo={bid._bidderRef}
          bidAmountHtml={() => (
            <div className="centeredButtonInCard">
              <div style={{ width: 200 }} className="has-text-centered has-text-grey">
                accept bid for
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.openBidDetailsModal(bid);
                }}
                style={{ width: 200 }}
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
      );
    });
    return (
      <div>
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
        {tableRows}
      </div>
    );
  }
}

const TableWithNoBids = ({ viewedByCount }) => {
  return (
    <div className="card has-text-centered" style={{ height: 'unset' }}>
      <div className="card-content">
        <div className="content">
          <div className="title">
            <span className="icon">
              <i className="fas fa-user-clock" />
            </span>
            <span style={{ marginLeft: 7 }}>Waiting for Taskers</span>
          </div>
          <div className="subtitle">
            {`${
              viewedByCount ? viewedByCount : ''
            } Tasker(s) viewing your task and will place bids soon`}
          </div>
        </div>
      </div>
    </div>
  );
};

class TaskerBidCard extends React.Component {
  render() {
    const { otherUserProfileInfo, bidAmountHtml } = this.props;
    if (!otherUserProfileInfo) {
      return null;
    }

    const {
      _id,
      rating,
      _asBidderReviewsRef,
      _asProposerReviewsRef,
      membershipStatus,
    } = otherUserProfileInfo;

    const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const {
      numberOfTimesBeenRated,
      globalRating,
      fulfilledBids,
      canceledBids,
      lastComment,
    } = rating;

    let asABidderReviews = null;
    if (_asBidderReviewsRef && _asBidderReviewsRef.length > 0) {
      asABidderReviews = _asBidderReviewsRef.map(({ _id, proposerId, proposerReview }) => {
        const { displayName, profileImage } = proposerId;

        return (
          <ReviewComments
            key={_id}
            commenterDisplayName={displayName}
            commenterProfilePicUrl={profileImage.url}
            comment={proposerReview.personalComment}
          />
        );
      });
    }

    let asAProposerReviewsRef = null;
    if (_asProposerReviewsRef && _asProposerReviewsRef.length > 0) {
      asAProposerReviewsRef = _asProposerReviewsRef.map(({ _id, bidderId, bidderReview }) => {
        const { displayName, profileImage } = bidderId;

        return (
          <ReviewComments
            key={_id}
            commenterDisplayName={displayName}
            commenterProfilePicUrl={profileImage.url}
            comment={bidderReview.personalComment}
          />
        );
      });
    }

    let displayComment = lastComment || 'This user was not reviewed yet!';
    if (displayComment.length > 100) {
      displayComment = displayComment.substring(0, 99);
    }

    return (
      <div style={{ marginBottom: '3rem' }} className="card cardWithButton nofixedwidth">
        <div className="card-content">
          <div style={{ marginBottom: '2rem' }} className="content">
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
            {/* <label className="help">
                    joined B.o.B: {moment.duration(moment().diff(moment(createdAt))).humanize()}
                  </label> */}

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
              <VerifiedVia
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
          </div>
        </div>
        {bidAmountHtml()}
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
