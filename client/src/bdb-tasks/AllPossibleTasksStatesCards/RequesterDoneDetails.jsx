import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import {
  CountDownComponent,
  DisplayLabelValue,
  TaskCost,
  TaskSpecificExtras,
  ArchiveTask,
  DestinationAddressValue,
  JobCardTitle,
  SummaryStartDateAndTime,
  TaskIsFulfilled,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import { getChargeDistributionDetails } from '../../containers/commonUtils';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class RequesterDoneDetails extends RequestBaseContainer {
  render() {
    const { job, cancelJobById, currentUserDetails } = this.props;
    const { _id: currentUserId } = currentUserDetails;

    if (!cancelJobById || !job || !currentUserDetails || !currentUserId) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      displayStatus,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
      },
      taskImages = [],
      jobTitle,
    } = job;
    if (
      !jobId ||
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !extras ||
      !detailedDescription ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { proposerConfirmed, bidderConfirmed } = jobCompletion;

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { requesterTotalPayment: requesterPayAmount } = getChargeDistributionDetails(bidValue);

    const { phone, email, _id: bidderId } = _bidderRef;
    if (!phone || !email || !bidderId) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { phoneNumber = 'not specified' } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { showMore } = this.state;
    debugger;
    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef || {
      revealToBoth: false,
      requiresProposerReview: true,
      requiresBidderReview: true,
    };
    debugger;
    return (
      <>
        <div style={{ height: 'auto' }} className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content has-text-centered">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              {!requiresProposerReview && <ArchiveTask />}

              {requiresProposerReview && <TaskIsFulfilled />}
              <TaskCost cost={requesterPayAmount} />
              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
                  <DisplayLabelValue labelText="Address" labelValue={addressText} />
                  {extras && extras.destinationText && (
                    <DestinationAddressValue
                      destionationAddress={extras.destinationText}
                    ></DestinationAddressValue>
                  )}
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
        </div>

        <br />
        <div style={{ background: 'transparent', marginBottom: 0 }} className="tabs is-centered">
          <ul>
            <li className="is-active">
              <a>
                <span className="icon is-small">
                  <i className="fas fa-user-tie" aria-hidden="true" />
                </span>
                <span>Your Tasker</span>
              </a>
            </li>
          </ul>
        </div>

        <AssignedTaskerDetails
          otherUserProfileInfo={_bidderRef}
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          renderActionButton={() => (
            <>
              {requiresProposerReview && (
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.REVIEW.getProposerJobReview({ jobId }));
                  }}
                  className={`button firstButtonInCard is-primary`}
                >
                  Review Tasker
                </a>
              )}
              {!requiresProposerReview && (
                <a
                  onClick={() => {
                    alert('Archive not implemented yet, will take you to archive');
                  }}
                  className={`button firstButtonInCard is-dark`}
                >
                  View In Archive
                </a>
              )}
            </>
          )}
        />
      </>
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
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequesterDoneDetails);

class AssignedTaskerDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, renderActionButton } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    const { _id } = otherUserProfileInfo;

    return (
      <div className="card cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content ">
            <div className="has-text-centered">
              <figure
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
                }}
                style={{ margin: 'auto', width: 90 }}
                className="image"
              >
                <img
                  style={{
                    borderRadius: '100%',
                    cursor: 'pointer',
                    boxShadow:
                      '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)',
                  }}
                  src={otherUserProfileInfo.profileImage.url}
                />
              </figure>
              <div style={{ marginBottom: 0 }} className={`title`}>
                <span>{otherUserProfileInfo.displayName}</span>
              </div>
              <br />
            </div>
          </div>
        </div>
        {renderActionButton && renderActionButton()}
      </div>
    );
  }
}
