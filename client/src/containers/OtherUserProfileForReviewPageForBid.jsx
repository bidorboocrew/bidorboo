/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import moment from 'moment';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOtherUserProfileInfo } from '../app-state/actions/userModelActions';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { Spinner } from '../components/Spinner';
import { VerifiedVia } from './commonComponents';
import * as Constants from '../constants/enumConstants';
import { ReviewCommentsForBidsTable } from './commonComponents.jsx';

class OtherUserProfileForReviewPageForBid extends React.Component {
  constructor(props) {
    super(props);
    if (props.match && props.match.params && props.match.params.userId) {
      const { userId } = props.match.params;
      this.userIdUnderReview = userId;
    } else {
      switchRoute(ROUTES.CLIENT.HOME);
    }
    this.state = { showExtraDetails: false };
  }

  componentDidMount() {
    // document.querySelector('body').setAttribute('style', 'background:white');
    if (this.userIdUnderReview) {
      this.props.getOtherUserProfileInfo(this.userIdUnderReview);
    }
  }
  toggleShowExtraDetails = () => {
    this.setState({ showExtraDetails: !this.state.showExtraDetails });
  };

  render() {
    const { showExtraDetails } = this.state;
    const {
      isLoadingAnotherUserProfile,
      otherUserProfileInfo,
      isMyPersonalProfile = false,
    } = this.props;
    if (!this.userIdUnderReview) {
      return null;
    }

    if (isLoadingAnotherUserProfile || !otherUserProfileInfo._id) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading />;
        </div>
      );
    }
    const {
      rating,
      createdAt,
      _asTaskerReviewsRef,
      membershipStatus,
      personalParagraph,
    } = otherUserProfileInfo;
    const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const { globalRating, fulfilledBids, canceledBids } = rating;

    let asATaskerReviews = null;
    if (_asTaskerReviewsRef && _asTaskerReviewsRef.length > 0) {
      asATaskerReviews = _asTaskerReviewsRef.map(
        ({ _id, requesterId, requesterReview, createdAt }) => {
          if (!requesterId) {
            return null;
          }
          const { displayName, profileImage } = requesterId;

          return (
            <ReviewCommentsForBidsTable
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

    return (
      <>
        <div style={{ marginBottom: 10 }} className="has-text-centered">
          <figure
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(otherUserProfileInfo._id));
            }}
            style={{ marginBottom: 6, display: 'inline-block' }}
            className="image is-64x64"
          >
            <img
              style={{
                borderRadius: '100%',
                width: 64,
                height: 64,
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
              }}
              src={otherUserProfileInfo.profileImage.url}
            />
          </figure>
          <label style={{ marginBottom: 0, fontSize: 21 }} className="label has-text-dark ">
            {otherUserProfileInfo.displayName}
          </label>
          {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
            <div className="has-text-grey" style={{ fontSize: 18 }}>
              <span className="icon has-text-warning">
                <i className="far fa-star" />
              </span>
              <span>--</span>
            </div>
          ) : (
            <div className="has-text-dark" style={{ fontSize: 18 }}>
              <span className="icon has-text-warning">
                <i className="fas fa-star" />
              </span>
              <span>{globalRating}</span>
            </div>
          )}
          <VerifiedVia userDetails={otherUserProfileInfo} />
        </div>
        <Collapse isOpened={showExtraDetails}>
          <div className="has-text-centered">
            <label className="help">{membershipStatusDisplay}</label>

            <label className="help">
              Member Since, {moment.duration(moment().diff(moment(createdAt))).humanize()}
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
          <div className="tile is-ancestor has-text-centered">
            <div className="tile is-parent">
              <article className="tile is-child box" style={{ boxShadow: 'none', padding: 0 }}>
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
              <article className="tile is-child box" style={{ boxShadow: 'none', padding: 0 }}>
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
          </div>

          <div style={{ background: 'transparent' }} className="tabs is-centered">
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

          {asATaskerReviews && asATaskerReviews.length > 0 ? (
            <React.Fragment>{asATaskerReviews}</React.Fragment>
          ) : (
            <p className="has-text-centered has-text-dark">No Reviews Yet</p>
          )}
        </Collapse>
        <div className="has-text-centered">
          {!showExtraDetails && (
            <a
              onClick={this.toggleShowExtraDetails}
              style={{ boxShadow: 'none' }}
              className="button is-small"
            >
              <span style={{ marginRight: 4 }}>view reviews</span>
              <span className="icon">
                <i className="fas fa-angle-double-down" />
              </span>
            </a>
          )}
          {showExtraDetails && (
            <a
              onClick={this.toggleShowExtraDetails}
              style={{ marginTop: 8, boxShadow: 'none' }}
              className="button is-small"
            >
              <span style={{ marginRight: 4 }}>hide reviews</span>
              <span className="icon">
                <i className="fas fa-angle-double-up" />
              </span>
            </a>
          )}
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
    dispatch,
    getOtherUserProfileInfo: bindActionCreators(getOtherUserProfileInfo, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfileForReviewPageForBid);
