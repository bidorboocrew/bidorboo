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
import { Spinner } from '../components/Spinner';
import { VerifiedVia } from './commonComponents';
import * as Constants from '../constants/enumConstants';
import { ReviewComments } from './commonComponents.jsx';
class OtherUserProfileForReviewPage extends React.Component {
  constructor(props) {
    super(props);
    if (props.match && props.match.params && props.match.params.userId) {
      const { userId } = props.match.params;
      this.userIdUnderReview = userId;
    } else {
      switchRoute(ROUTES.CLIENT.HOME);
    }

    this.state = {
      reviewsSelectedButton: 'fromRequesters',
    };
  }

  setReviewsSelectedButton = (val) => {
    this.setState({ reviewsSelectedButton: val });
  };
  componentDidMount() {
    if (this.userIdUnderReview) {
      this.props.getOtherUserProfileInfo(this.userIdUnderReview);
    }
  }

  render() {
    const {
      isLoadingAnotherUserProfile,
      otherUserProfileInfo,
      isMyPersonalProfile = false,
      renderBeforeComments = () => null,
    } = this.props;
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
      _asTaskerReviewsRef,
      _asProposerReviewsRef,
      membershipStatus,
      personalParagraph,
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

    let asATaskerReviews = null;
    if (_asTaskerReviewsRef && _asTaskerReviewsRef.length > 0) {
      asATaskerReviews = _asTaskerReviewsRef.map(({ _id, proposerId, proposerReview }) => {
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
      asAProposerReviewsRef = _asProposerReviewsRef.map(({ _id, taskerId, taskerReview }) => {
        if (!taskerId) {
          return null;
        }
        const { displayName, profileImage } = taskerId;

        return (
          <ReviewComments
            key={_id}
            commenterDisplayName={displayName}
            commenterProfilePicUrl={profileImage.url}
            comment={taskerReview.personalComment}
          />
        );
      });
    }

    return (
      <>
        <br></br>
        <div className="container is-widescreen">
          {!isMyPersonalProfile && (
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
          )}

          <div className="card noBordered">
            <div className="card-content">
              <div className="content">
                {/* <div>
                Global Rating <strong> {globalRating} </strong>
              </div> */}
                {!isMyPersonalProfile && (
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
                      Member Since: {moment.duration(moment().diff(moment(createdAt))).humanize()}
                    </label>
                    <br></br>
                    {personalParagraph && (
                      <div className="group has-text-centered">
                        <label className="label">Personal description:</label>
                        <p className="has-text-centered control">{personalParagraph}</p>
                        <br></br>
                      </div>
                    )}
                  </div>
                )}
                <div className="tile is-ancestor has-text-centered">
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p className="is-size-7">Completed Tasks</p>
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          fulfilledBids.length > 0 ? 'has-text-success' : ''
                        }`}
                      >
                        {fulfilledBids.length}
                      </p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p className="is-size-7">Cancelled Tasks</p>
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          canceledBids.length > 0 ? 'has-text-danger' : ''
                        }`}
                      >
                        {canceledBids.length}
                      </p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p className="is-size-7">Fulfilled Requests</p>
                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold ${
                          fulfilledJobs.length > 0 ? 'has-text-success' : ''
                        }`}
                      >
                        {fulfilledJobs.length}
                      </p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p className="is-size-7">Cancelled Requests</p>

                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold${
                          canceledJobs.length > 0 ? 'has-text-danger' : ''
                        }`}
                      >
                        {canceledJobs.length}
                      </p>
                    </article>
                  </div>
                </div>

                <div style={{ background: 'transparent' }} className="tabs is-centered">
                  <ul style={{ marginLeft: 0 }}>
                    <li className="is-active">
                      <a>
                        <span>{`${
                          numberOfTimesBeenRated === 1
                            ? `1 Review`
                            : `${numberOfTimesBeenRated} Reviews`
                        } `}</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {(asATaskerReviews || asAProposerReviewsRef) && (
                  <div className="field has-addons">
                    <p className="control">
                      <button
                        onClick={() => this.setReviewsSelectedButton('fromRequesters')}
                        style={{ borderRadius: 0, boxShadow: 'none' }}
                        className={`button ${
                          this.state.reviewsSelectedButton === 'fromRequesters'
                            ? 'is-success is-selected'
                            : ''
                        } `}
                      >
                        <span>From Requesters</span>
                      </button>
                    </p>

                    <p className="control">
                      <button
                        onClick={() => this.setReviewsSelectedButton('fromTaskers')}
                        style={{ borderRadius: 0, boxShadow: 'none' }}
                        className={`button ${
                          this.state.reviewsSelectedButton === 'fromTaskers'
                            ? 'is-success is-selected'
                            : ''
                        } `}
                      >
                        <span>From Taskers</span>
                      </button>
                    </p>
                  </div>
                )}

                {asATaskerReviews && this.state.reviewsSelectedButton === 'fromRequesters' && (
                  <React.Fragment>{asATaskerReviews}</React.Fragment>
                )}

                {asAProposerReviewsRef && this.state.reviewsSelectedButton === 'fromTaskers' && (
                  <React.Fragment>{asAProposerReviewsRef}</React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfileForReviewPage);
