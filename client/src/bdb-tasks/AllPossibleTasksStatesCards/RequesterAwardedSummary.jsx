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
  JobCardTitle,
  SummaryStartDateAndTime,
  AssignedTasker,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

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
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
        bidderDisputed: false,
        proposerDisputed: false,
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

    if (!_awardedBidRef._bidderRef) {
      return <div>RequesterAwardedSummary is missing properties</div>;
    }

    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterAwardedSummary is missing properties</div>;
    }

    const { bidderConfirmed } = jobCompletion;
    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #26ca70' }}
          className="card has-text-centered cardWithButton"
        >
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} />

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              <AssignedTasker displayName={_awardedBidRef._bidderRef.displayName} />
            </div>
          </div>

          <div className="centeredButtonInCard">
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
              }}
              className={`button is-success`}
            >
              View Details
            </a>
          </div>
        </div>
      </React.Fragment>
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
