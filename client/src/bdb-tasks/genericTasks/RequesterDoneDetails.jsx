import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  UserImageAndRating,
  AddAwardedJobToCalendar,
  EffortLevel,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from '../RequestBaseContainer';

class RequesterAwardedDetails extends RequestBaseContainer {
  render() {
    const { job, cancelJobById, currentUserDetails } = this.props;
    const { _id: currentUserId } = currentUserDetails;

    if (!cancelJobById || !job || !currentUserDetails || !currentUserId) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
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
        bidderDisputed: false,
        proposerDisputed: false,
      },
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
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { proposerConfirmed, bidderConfirmed, bidderDisputed, proposerDisputed } = jobCompletion;

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { phone, email, _id: bidderId } = _bidderRef;
    if (!phone || !email || !bidderId) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { phoneNumber = 'not specified' } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { TITLE } = TASKS_DEFINITIONS[`${job.fromTemplateId}`];
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { showMore } = this.state;
    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef;

    return (
      <div style={{ height: 'auto' }} className="card">
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className="fas fa-home" />
                </span>
                <span style={{ marginLeft: 4 }}>{TITLE}</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />

            {!requiresProposerReview && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-dark">Archived !</div>
                <div className="help">* Congratulations. This was a success</div>
              </div>
            )}

            {requiresProposerReview && (
              <div className="field">
                <label className="label">Request Status</label>
                <div className="control has-text-success">Done!</div>
                <div className="help">* Congratulations. Now it is time to review the Tasker</div>
              </div>
            )}

            <div className="field">
              <label className="label">Task Cost</label>
              <div className="control">{`${bidValue -
                Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* Paid out to Tasker.</div>
            </div>
            <StartDateAndTime date={startingDateAndTime} />

            <DisplayLabelValue labelText="Address" labelValue={addressText} />

            {showMore && (
              <React.Fragment>
                <EffortLevel extras={extras} />
                <div className="field">
                  <label className="label">Detailed Description</label>
                  <span className="is-size-7">
                    <TextareaAutosize
                      value={detailedDescription}
                      className="textarea is-marginless is-paddingless is-size-6"
                      style={{
                        resize: 'none',
                        border: 'none',
                        color: '#4a4a4a',
                        fontSize: '1rem',
                      }}
                      readOnly
                    />
                  </span>
                </div>
              </React.Fragment>
            )}
            <div>
              {!showMore && (
                <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                  <span style={{ marginRight: 4 }}>show full details</span>
                  <span className="icon">
                    <i className="fas fa-angle-double-down" />
                  </span>
                </a>
              )}
              {showMore && (
                <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                  <span style={{ marginRight: 4 }}>show less details</span>
                  <span className="icon">
                    <i className="fas fa-angle-double-up" />
                  </span>
                </a>
              )}
            </div>
            <hr className="divider" />
            <div className="field">
              <label className="label">Assigned Tasker Details</label>
              <UserImageAndRating userDetails={_bidderRef} />
            </div>
          </div>
          <hr className="divider isTight" />
          <div style={{ display: 'flex' }}>
            {requiresProposerReview && (
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.REVIEW.getProposerJobReview({ jobId }));
                }}
                className={`button is-fullwidth is-success`}
              >
                Review Tasker
              </a>
            )}
            {!requiresProposerReview && (
              <a
                onClick={() => {
                  alert('Archive not implemented yet, will take you to archieve');
                }}
                className={`button is-fullwidth is-outlined is-info`}
              >
                View In Archive
              </a>
            )}
          </div>
        </div>
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequesterAwardedDetails);
