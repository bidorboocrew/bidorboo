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

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
import RequestBaseContainer from '../RequestBaseContainer';

class HouseCleaningAwardedDetails extends RequestBaseContainer {
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

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { phone, email, _id: bidderId } = _bidderRef;
    if (!phone || !email || !bidderId) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { phoneNumber } = phone;
    if (!phoneNumber) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { emailAddress } = email;
    if (!emailAddress) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;
    const { proposerConfirmed, bidderConfirmed, bidderDisputed, proposerDisputed } = jobCompletion;
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

              <div
                ref={(node) => (this.node = node)}
                className={`dropdown is-right ${showMoreOptionsContextMenu ? 'is-active' : ''}`}
              >
                <div className="dropdown-trigger">
                  <button
                    onClick={this.toggleShowMoreOptionsContextMenu}
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    style={{ border: 'none' }}
                  >
                    <div style={{ padding: 6 }} className="icon">
                      <i className="fas fa-ellipsis-v" />
                    </div>
                  </button>
                </div>
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
            <div className="field">
              <label className="label">Request Status</label>
              <div className="control has-text-success">Done !</div>
              <div className="help">* Congratulations. Now it is time to review the tasker</div>
            </div>

            <div className="field">
              <label className="label">Task Cost</label>
              <div className="control has-text-success">{`${bidValue -
                Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* Paid out to Tasker.</div>
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

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
              <div className="control">
                <span className="icon">
                  <i className="far fa-envelope" />
                </span>
                <span>{emailAddress}</span>
              </div>
              <div className="control">
                <span className="icon">
                  <i className="fas fa-phone" />
                </span>
                <span>{phoneNumber}</span>
              </div>
              {!isPastDue && <AddAwardedJobToCalendar job={job} />}
            </div>
          </div>
          <hr className="divider isTight" />
          <div style={{ display: 'flex' }}>
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.REVIEW.getProposerJobReview({currentUserId, jobId, bidderId}),
                );
              }}
              className={`button hearbeatInstant is-fullwidth is-success`}
            >
              Review Tasker
            </a>
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
)(HouseCleaningAwardedDetails);
