import React from 'react';
import moment from 'moment';
import ReactStars from 'react-stars';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute, goBackToPreviousRoute } from '../../../utils';
import { UserImageAndRating, VerifiedVia } from '../../../containers/commonComponents';
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
    const { bidList } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    if (!areThereAnyBids) {
      return <TableWithNoBids />;
    }

    let tableRows = bidList.map((bid) => {
      const totalCharge =
        bid.bidAmount && bid.bidAmount.value
          ? Math.ceil(bid.bidAmount.value * BIDORBOO_SERVICECHARGE) + bid.bidAmount.value
          : 'not specified';

      return (
        <div style={{ marginBottom: '3.5rem' }} key={bid._bidderRef._id}>
          <OtherUserProfileForReviewPage
            key={bid._bidderRef._id}
            otherUserProfileInfo={bid._bidderRef}
            bidAmountHtml={() => (
              <button
                style={{ height: 'unset' }}
                className="button is-success has-text-centered bidButtonInCard"
              >
                <div className="tile is-ancestor has-text-centered">
                  <div className="tile is-parent has-text-centered">
                    <article
                      onClick={(e) => {
                        e.preventDefault();
                        this.openBidDetailsModal(bid);
                      }}
                    >
                      <div className="has-text-white">
                        <span>{'will do it for '}</span>
                        <span className="has-text-weight-bold is-size-4">${totalCharge}</span>
                      </div>
                      <div className="has-text-white help">{`select & checkout`}</div>
                      {bid.isNewBid && (
                        <span
                          style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}
                          className="has-text-danger"
                        >
                          <i className="fas fa-circle" />
                        </span>
                      )}
                    </article>
                  </div>
                </div>
              </button>
            )}
          />
        </div>
      );
    });
    return (
      <div>
        <div style={{ background: 'transparent' }} className="tabs is-medium is-centered">
          <ul>
            <li className="is-active">
              <a>
                <span className="icon is-small">
                  <i className="fas fa-user" aria-hidden="true" />
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

const TableWithNoBids = () => {
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
            Taskers are reviewing your task and will place thier bids shortly
          </div>
        </div>
      </div>
    </div>
  );
};

class OtherUserProfileForReviewPage extends React.Component {
  render() {
    const { otherUserProfileInfo, bidAmountHtml } = this.props;
    if (!otherUserProfileInfo) {
      return null;
    }

    const {
      _id,
      rating,
      createdAt,
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

    return (
      <div className="card cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content">
            <div>
              <div style={{ display: 'flex' }}>
                <div>
                  <figure
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
                    }}
                    style={{ marginLeft: 0, marginRight: 0, marginBottom: '0.25rem' }}
                    className="image is-128x128"
                  >
                    <img
                      style={{
                        borderRadius: 6,
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                      }}
                      src={otherUserProfileInfo.profileImage.url}
                    />
                  </figure>
                  <label style={{ marginBottom: 0 }} className="label">
                    {otherUserProfileInfo.displayName}
                  </label>
                  {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                    <div>No Ratings Yet</div>
                  ) : (
                    <ReactStars
                      className="ReactStars"
                      half
                      count={5}
                      value={globalRating}
                      edit={false}
                      size={30}
                      color1={'lightgrey'}
                      color2={'#ffd700'}
                    />
                  )}

                  <div>Status: {membershipStatusDisplay}</div>
                  {/* <label className="help">
                    joined B.o.B: {moment.duration(moment().diff(moment(createdAt))).humanize()}
                  </label> */}
                  <VerifiedVia
                    userDetails={otherUserProfileInfo}
                    isCentered={false}
                    smallfont={false}
                  />
                </div>
                <div style={{ flexGrow: 1, padding: '0 0.75rem 4rem 0.75rem' }}>
                  <div>
                    <div
                      style={{ marginBottom: '1rem' }}
                      className="tile has-text-centered is-ancestor"
                    >
                      <div className="tile is-parent">
                        <article style={{ margin: 'auto' }}>
                          <p style={{ marginBottom: 4 }} className={`has-text-weight-bold`}>
                            {numberOfTimesBeenRated}
                          </p>
                          <p>Ratings</p>
                        </article>
                      </div>

                      <div className="tile is-parent">
                        <article style={{ margin: 'auto' }}>
                          <p
                            style={{ marginBottom: 4 }}
                            className={`has-text-weight-bold ${
                              fulfilledBids.length > 0 ? 'has-text-success' : ''
                            }`}
                          >
                            {fulfilledBids.length}
                          </p>
                          <p>Completed Tasks</p>
                        </article>
                      </div>
                      <div className="tile is-parent">
                        <article style={{ margin: 'auto' }}>
                          <p
                            style={{ marginBottom: 4 }}
                            className={`has-text-weight-bold ${
                              canceledBids.length > 0 ? 'has-text-danger' : ''
                            }`}
                          >
                            {canceledBids.length}
                          </p>
                          <p>Cancellations</p>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div style={{ margin: 'auto' }} className="field has-text-centered">
                    <label className="label">Last Review</label>
                    <div className="control  has-text-centered">
                      {`"${lastComment || 'This user was not reviewed yet!'}"  `}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {bidAmountHtml()}
          </div>
        </div>
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
