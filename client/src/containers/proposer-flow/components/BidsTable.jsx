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
        <React.Fragment>
          <OtherUserProfileForReviewPage
            key={bid._bidderRef._id}
            otherUserProfileInfo={bid._bidderRef}
          />
          <br />
        </React.Fragment>
        // <tr key={bid._id} style={{ wordWrap: 'break-word' }}>
        //   <td style={{ verticalAlign: 'middle' }}>
        //     <UserImageAndRating userDetails={bid._bidderRef} large clipUserName={true} />
        //     <VerifiedVia userDetails={bid._bidderRef} isCentered={false} />
        //   </td>

        //   <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
        //     <div className="tile is-ancestor has-text-centered">
        //       <div className="tile is-parent">
        //         <article
        //           style={{
        //             padding: '0.25rem',
        //             cursor: 'pointer',
        //             position: 'relative',
        //             border: '2px solid hsl(141, 71%, 48%)',
        //           }}
        //           onClick={(e) => {
        //             e.preventDefault();
        //             this.openBidDetailsModal(bid);
        //           }}
        //           className=""
        //         >
        //           <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
        //             {totalCharge}
        //           </p>
        //           <p className="is-size-6">$ ({bid.bidAmount && bid.bidAmount.currency})</p>
        //           <div className="help">Click To Review</div>
        //           {bid.isNewBid && (
        //             <span
        //               style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}
        //               className="has-text-danger"
        //             >
        //               <i className="fas fa-circle" />
        //             </span>
        //           )}
        //         </article>
        //       </div>
        //     </div>
        //   </td>
        // </tr>
      );
    });
    debugger;
    return <div>{tableRows}</div>;
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
    const { otherUserProfileInfo } = this.props;
    if (!otherUserProfileInfo) {
      return null;
    }

    const {
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
      fulfilledJobs,
      canceledJobs,
      // lastComment
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
              <figure
                style={{ marginLeft: 0, marginRight: 0, marginBottom: '0.25rem' }}
                className="image is-128x128"
              >
                <img src={otherUserProfileInfo.profileImage.url} />
              </figure>
              <label style={{ marginBottom: 0 }} className="label">
                {otherUserProfileInfo.displayName}
              </label>
              {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                <p className="is-size-7">No Ratings Yet</p>
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
              <VerifiedVia userDetails={otherUserProfileInfo} isCentered={false} />

              <label className="help">Status: {membershipStatusDisplay}</label>

              <label className="help">
                Member Sicne: {moment.duration(moment().diff(moment(createdAt))).humanize()}
              </label>
            </div>

            <div className="tile is-ancestor has-text-centered">
              <div className="tile is-parent">
                <article className="">
                  <p style={{ marginBottom: 4 }} className="is-size-6 has-text-weight-bold">
                    {numberOfTimesBeenRated}
                  </p>
                  <p>ratings recieved</p>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="">
                  <p
                    style={{ marginBottom: 4 }}
                    className={`is-size-6 has-text-weight-bold ${
                      fulfilledBids.length > 0 ? 'has-text-success' : ''
                    }`}
                  >
                    {fulfilledBids.length}
                  </p>
                  <p>Completed Tasks</p>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="">
                  <p
                    style={{ marginBottom: 4 }}
                    className={`is-size-6 has-text-weight-bold ${
                      canceledBids.length > 0 ? 'has-text-danger' : ''
                    }`}
                  >
                    {canceledBids.length}
                  </p>
                  <p>Cancelled Tasks</p>
                </article>
              </div>
            </div>

            {asABidderReviews && (
              <React.Fragment>
                <br />
                <hr className="divider isTight" />
                <label className="label">Reviews recieved as a Tasker :</label>
                {asABidderReviews}
              </React.Fragment>
            )}

            {asAProposerReviewsRef && (
              <React.Fragment>
                <br />
                <hr className="divider isTight" />
                <label className="label">Reviews recieved as a Requester :</label>
                {asAProposerReviewsRef}
              </React.Fragment>
            )}
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
