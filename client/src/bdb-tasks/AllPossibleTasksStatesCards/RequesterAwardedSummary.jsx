import React from 'react';

import { connect } from 'react-redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  JobCardTitle,
  SummaryStartDateAndTime,
  AssignedTasker,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class RequesterAwardedSummary extends RequestBaseContainer {
  render() {
    const { job, cancelJobById } = this.props;
    const {
      _id: jobId,
      startingDateAndTime,
      _awardedBidRef,
      bidderConfirmedCompletion,
      jobTitle,
      taskImages = [],
    } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    return (
      <React.Fragment>
        <div
          style={{ border: '1px solid #26ca70' }}
          className="card has-text-centered cardWithButton"
        >
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} />
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
              {bidderConfirmedCompletion ? 'CONFIRM COMPLETION' : 'VIEW DETAILS'}
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

export default connect(mapStateToProps, null)(RequesterAwardedSummary);
