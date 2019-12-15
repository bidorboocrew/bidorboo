import React from 'react';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  SummaryStartDateAndTime,
  JobCardTitle,
  TaskIsFulfilled,
  CountDownComponent,
  TaskImagesCarousel,
  ArchiveTask,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class RequesterDoneSummary extends RequestBaseContainer {
  render() {
    const { job } = this.props;

    const { _id: jobId, startingDateAndTime, _reviewRef, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    const { requiresProposerReview } = _reviewRef || {
      revealToBoth: false,
      requiresProposerReview: true,
      requiresBidderReview: true,
    };

    return (
      <div className="card has-text-centered cardWithButton">
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
            {!requiresProposerReview && <ArchiveTask />}

            {requiresProposerReview && <TaskIsFulfilled />}
          </div>
        </div>

        <div className="centeredButtonInCard ">
          {!requiresProposerReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
              }}
              className="button is-dark"
            >
              VIEW DETAILS
            </a>
          )}
          {requiresProposerReview && (
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
              }}
              className="button is-primary"
            >
              REVIEW TASKER
            </a>
          )}
        </div>
      </div>
    );
  }
}
