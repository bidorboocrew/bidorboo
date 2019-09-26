/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOtherUserProfileInfo } from '../app-state/actions/userModelActions';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute, goBackToPreviousRoute } from '../utils';
import ReactStars from 'react-stars';
import { Spinner } from '../components/Spinner';
import { VerifiedVia } from './commonComponents';
import * as Constants from '../constants/enumConstants';

class OtherUserProfileForReviewPage extends React.Component {
  constructor(props) {
    super(props);
    if (props.match && props.match.params && props.match.params.userId) {
      const { userId } = props.match.params;
      this.userIdUnderReview = userId;
    } else {
      switchRoute(ROUTES.CLIENT.HOME);
    }
  }
  componentDidMount() {
    if (this.userIdUnderReview) {
      this.props.getOtherUserProfileInfo(this.userIdUnderReview);
    }
  }

  render() {
    const { isLoadingAnotherUserProfile, otherUserProfileInfo } = this.props;
    if (!this.userIdUnderReview) {
      return null;
    }

    if (isLoadingAnotherUserProfile || !otherUserProfileInfo._id) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={isLoadingAnotherUserProfile} size={'large'} />;
        </div>
      );
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
        if (!proposerId) {
          return null;
        }
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
        if (!bidderId) {
          return null;
        }
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
      <>
        <br></br>
        <div className="container is-widescreen">
          <section className="hero is-white is-small">
            <div className="hero-body">
              <h1 className="title">
                <span className="icon">
                  <i className="far fa-user" />
                </span>
                <span>{` ${otherUserProfileInfo.displayName}'s Profile`}</span>
              </h1>
              <h2>
                <a className="button is-link" onClick={() => goBackToPreviousRoute()}>
                  <span className="icon">
                    <i className="far fa-arrow-alt-circle-left" />
                  </span>
                  <span>Go Back</span>
                </a>
              </h2>
            </div>
          </section>

          <div className="card noBordered">
            <div className="card-content">
              <div className="content">
                {/* <div>
                Global Rating <strong> {globalRating} </strong>
              </div> */}
                <div style={{ marginBottom: 10 }} className="has-text-centered">
                  <figure
                    style={{ marginBottom: 6, display: 'inline-block' }}
                    className="image is-128x128"
                  >
                    <img
                      style={{
                        width: 128,
                        height: 128,
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
                      }}
                      src={otherUserProfileInfo.profileImage.url}
                    />
                  </figure>
                  <label style={{ marginBottom: 0 }} className="label">
                    {otherUserProfileInfo.displayName}
                  </label>
                  {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                    <div className="has-text-grey" style={{ lineHeight: '52px', fontSize: 18 }}>
                      <span className="icon">
                        <i className="far fa-star" />
                      </span>
                      <span>--</span>
                    </div>
                  ) : (
                    <div className="has-text-dark" style={{ lineHeight: '52px', fontSize: 18 }}>
                      <span className="icon">
                        <i className="fas fa-star" />
                      </span>
                      <span>{globalRating}</span>
                    </div>
                  )}
                  <VerifiedVia userDetails={otherUserProfileInfo} />

                  <label className="help">Status: {membershipStatusDisplay}</label>

                  <label className="help">
                    Member Sicne: {moment.duration(moment().diff(moment(createdAt))).humanize()}
                  </label>
                </div>
                <div className="tile is-ancestor has-text-centered">
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p style={{ marginBottom: 4 }} className="title has-text-weight-bold">
                        {numberOfTimesBeenRated}
                      </p>
                      <p className="is-size-6">ratings recieved</p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          fulfilledBids.length > 0 ? 'has-text-success' : ''
                        }`}
                      >
                        {fulfilledBids.length}
                      </p>
                      <p className="is-size-6">Completed Tasks</p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          canceledBids.length > 0 ? 'has-text-danger' : ''
                        }`}
                      >
                        {canceledBids.length}
                      </p>
                      <p className="is-size-6">Cancelations of Agreements</p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          fulfilledJobs.length > 0 ? 'has-text-success' : ''
                        }`}
                      >
                        {fulfilledJobs.length}
                      </p>
                      <p className="is-size-6">Requests Posted and fullfilled</p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold${
                          canceledJobs.length > 0 ? 'has-text-danger' : ''
                        }`}
                      >
                        {canceledJobs.length}
                      </p>
                      <p className="is-size-6">Requests Cancelled after agreement</p>
                    </article>
                  </div>
                </div>

                {asABidderReviews && (
                  <React.Fragment>
                    <br />
                    <label className="label">Reviews recieved as a Tasker :</label>
                    {asABidderReviews}
                  </React.Fragment>
                )}

                {asAProposerReviewsRef && (
                  <React.Fragment>
                    <br />
                    <label className="label">Reviews recieved as a Requester :</label>
                    {asAProposerReviewsRef}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoadingAnotherUserProfile: userReducer.isLoadingAnotherUserProfile,
    otherUserProfileInfo: userReducer.otherUserProfileInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getOtherUserProfileInfo: bindActionCreators(getOtherUserProfileInfo, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OtherUserProfileForReviewPage);

const ReviewComments = ({ commenterDisplayName, commenterProfilePicUrl, comment }) => {
  return (
    <article
      style={{ cursor: 'default', border: '1px solid #ededed', padding: 2 }}
      className="media"
    >
      <figure style={{ margin: '0.5rem' }} className="media-left">
        <p className="image is-64x64">
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
