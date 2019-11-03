import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bidderConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  TaskSpecificExtras,
  JobCardTitle,
  SummaryStartDateAndTime,
  BidAmount,
  CenteredUserImageAndRating,
  TaskIsFulfilled,
  ArchiveTask,
  TaskImagesCarousel,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class TaskerMyAwardedDoneBidDetails extends RequestBaseContainer {
  render() {
    const { bid, currentUserDetails } = this.props;
    if (!bid || !bid._id || !currentUserDetails) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { _jobRef: job } = bid;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      displayStatus,
      _ownerRef,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
      taskImages = [],
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !extras ||
      !detailedDescription ||
      !displayStatus ||
      !_ownerRef
    ) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { bidAmount } = bid;
    if (!bidAmount) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }
    const { requiresBidderReview } = _reviewRef;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;

    return (
      <React.Fragment>
        <div
          style={{
            boxShadow: 'none',
            borderLeft: '1px solid rgba(10,10,10,0.2)',
            borderTop: '1px solid rgba(10,10,10,0.2)',
            borderRight: '1px solid rgba(10,10,10,0.2)',
          }}
          className="card has-text-centered"
        >
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              {!requiresBidderReview && <ArchiveTask />}

              {requiresBidderReview && <TaskIsFulfilled />}

              <Collapse isOpened={showMore}>
                <div className="has-text-left">
                  <BidAmount
                    bidAmount={bidValue}
                    renderHelp={() => <div className="help">Your Payout is on the way</div>}
                  />
                  <div className="group">
                    <label className="label hasSelectedValue">Task Address</label>
                    <div className="control">{addressText}</div>
                  </div>
                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <div className="group">
                    <label className="label hasSelectedValue">Detailed Description</label>
                    <TextareaAutosize
                      value={detailedDescription}
                      className="textarea is-marginless is-paddingless control"
                      style={{
                        resize: 'none',
                        border: 'none',
                      }}
                      readOnly
                    />
                  </div>
                </div>
              </Collapse>
              <div>
                {!showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show more details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-down" />
                    </span>
                  </a>
                )}
                {showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show less details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-up" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <RequesterDetails
            otherUserProfileInfo={_ownerRef}
            renderActionButton={() => (
              <>
                {requiresBidderReview && (
                  <a
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.REVIEW.getBidderJobReview({ jobId }));
                    }}
                    className={`button firstButtonInCard is-primary`}
                  >
                    <span>Review Requester & Task</span>
                  </a>
                )}
                {!requiresBidderReview && (
                  <a
                    onClick={() => {
                      alert('Archive not implemented yet, will take you to archieve');
                    }}
                    className={`button firstButtonInCard is-dark`}
                  >
                    Archived
                  </a>
                )}
              </>
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    currentUserDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bidderConfirmsJobCompletion: bindActionCreators(bidderConfirmsJobCompletion, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedDoneBidDetails);

class RequesterDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, renderActionButton } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    return (
      <div
        style={{
          boxShadow: 'none',
          borderLeft: '1px solid rgba(10,10,10,0.2)',
          borderBottom: '1px solid rgba(10,10,10,0.2)',
          borderRight: '1px solid rgba(10,10,10,0.2)',
        }}
        className="card cardWithButton nofixedwidth"
      >
        <div style={{ paddingTop: 0 }} className="card-content">
          <div className="content has-text-left">
            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-user-tie" aria-hidden="true" />
                    </span>
                    <span>Task Requester</span>
                  </a>
                </li>
              </ul>
            </div>
            <CenteredUserImageAndRating
              userDetails={otherUserProfileInfo}
              large
              isCentered={false}
            />
            <br />
          </div>
        </div>
        {renderActionButton && renderActionButton()}
      </div>
    );
  }
}
