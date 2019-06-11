import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  UserImageAndRating,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from '../RequestBaseContainer';

class RequesterAwardedSummary extends RequestBaseContainer {
  render() {
    const { job, cancelJobById } = this.props;
    if (!job || !job._id || !cancelJobById) {
      return <div>RequesterAwardedSummary is missing properties</div>;
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      displayStatus,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
      _awardedBidRef,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
    } = job;
    if (
      !jobId ||
      !_awardedBidRef ||
      !startingDateAndTime ||
      !addressText ||
      !displayStatus ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>RequesterAwardedSummary is missing properties</div>;
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
    const { TITLE } = TASKS_DEFINITIONS[`${job.fromTemplateId}`];
    if (!TITLE) {
      return <div>RequesterAwardedSummary is missing properties</div>;
    }
    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef;

    return (
      <div className="card limitWidthOfCard">
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

            <StartDateAndTime date={startingDateAndTime} />
            <DisplayShortAddress addressText={addressText} />
          </div>
        </div>

        <div style={{ padding: '0.5rem' }}>
          <hr className="divider isTight" />
        </div>
        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
          {requiresProposerReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
              }}
              className={`button is-fullwidth is-success`}
            >
              Review Tasker
            </a>
          )}
          {!requiresProposerReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
              }}
              className={`button is-fullwidth is-outlined`}
            >
              View In Archive
            </a>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
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
)(RequesterAwardedSummary);
