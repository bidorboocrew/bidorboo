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
import { switchRoute } from '../utils';
import { Spinner } from '../components/Spinner';
import { VerifiedVia } from './commonComponents';
import * as Constants from '../constants/enumConstants';
import { RenderBackButton, ReviewComments } from './commonComponents.jsx';

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
    document.querySelector('body').setAttribute('style', 'background:white');
    if (this.userIdUnderReview) {
      this.props.getOtherUserProfileInfo(this.userIdUnderReview);
    }
  }

  componentWillUnmount() {
    document.querySelector('body').setAttribute('style', 'background:#eeeeee');
  }

  render() {
    const {
      isLoadingAnotherUserProfile,
      otherUserProfileInfo,
      isMyPersonalProfile = false,
      nextAction = null,
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
      _asRequesterReviewsRef,
      membershipStatus,
      personalParagraph,
    } = otherUserProfileInfo;
    const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const {
      globalRating,
      fulfilledBids,
      canceledBids,
      fulfilledRequests,
      canceledRequests,
    } = rating;

    let asATaskerReviews = null;
    if (_asTaskerReviewsRef && _asTaskerReviewsRef.length > 0) {
      asATaskerReviews = _asTaskerReviewsRef.map(
        ({ _id, requesterId, requesterReview, createdAt }) => {
          if (!requesterId) {
            return null;
          }
          const { displayName, profileImage } = requesterId;

          return (
            <ReviewComments
              key={_id}
              commenterDisplayName={displayName}
              commenterProfilePicUrl={profileImage.url}
              comment={requesterReview.personalComment}
              createdAt={createdAt}
            />
          );
        },
      );
    }

    let asARequesterReviewsRef = null;
    if (_asRequesterReviewsRef && _asRequesterReviewsRef.length > 0) {
      asARequesterReviewsRef = _asRequesterReviewsRef.map(
        ({ _id, taskerId, taskerReview, createdAt }) => {
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
              createdAt={createdAt}
            />
          );
        },
      );
    }

    return (
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          {!isMyPersonalProfile && (
            <>
              <div style={{ margin: '1rem 0.5rem 1rem 0.5rem', height: 52 }}>
                <div className="is-pulled-left">
                  <RenderBackButton></RenderBackButton>
                </div>

                {nextAction && nextAction.text && nextAction.clickHandler && (
                  <div className="is-pulled-right">
                    <button
                      onClick={nextAction.clickHandler}
                      style={{ margin: '0px 0px 1rem' }}
                      className="button is-success"
                    >
                      <span style={{ meaginRight: 2 }}>{nextAction.text}</span>
                      <span className="icon is-large">
                        <i className="fas fa-chevron-right" />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
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
                        <span className="icon has-text-warning">
                          <i className="far fa-star" />
                        </span>
                        <span>--</span>
                      </div>
                    ) : (
                      <div className="has-text-dark" style={{ lineHeight: '52px', fontSize: 18 }}>
                        <span className="icon has-text-warning">
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
                          fulfilledRequests.length > 0 ? 'has-text-success' : ''
                        }`}
                      >
                        {fulfilledRequests.length}
                      </p>
                    </article>
                  </div>
                  <div className="tile is-parent">
                    <article className="tile is-child box">
                      <p className="is-size-7">Cancelled Requests</p>

                      <p
                        style={{ marginBottom: 4 }}
                        className={`title has-text-weight-bold${
                          canceledRequests.length > 0 ? 'has-text-danger' : ''
                        }`}
                      >
                        {canceledRequests.length}
                      </p>
                    </article>
                  </div>
                </div>

                <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
                  <ul style={{ marginLeft: 0 }}>
                    <li className="is-active">
                      <a>
                        <span className="icon">
                          <i className="fas fa-book"></i>
                        </span>
                        <span>Reviews</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {(asATaskerReviews || asARequesterReviewsRef) && (
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
                        <span>{`From Requesters (${
                          asATaskerReviews ? asATaskerReviews.length : 0
                        })`}</span>
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
                        <span>{`From Taskers (${
                          asARequesterReviewsRef ? asARequesterReviewsRef.length : 0
                        })`}</span>
                      </button>
                    </p>
                  </div>
                )}

                {asATaskerReviews && this.state.reviewsSelectedButton === 'fromRequesters' && (
                  <React.Fragment>{asATaskerReviews}</React.Fragment>
                )}

                {asARequesterReviewsRef && this.state.reviewsSelectedButton === 'fromTaskers' && (
                  <React.Fragment>{asARequesterReviewsRef}</React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    dispatch,
    getOtherUserProfileInfo: bindActionCreators(getOtherUserProfileInfo, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfileForReviewPage);
